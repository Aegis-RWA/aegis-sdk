import { Networks } from '@stellar/stellar-sdk';
import {
  AdminActionReceipt,
  AdminActionReceiptInput,
  AdminActionStatus,
  AdminReceiptError,
  AdminTransactionStatusInput,
} from '../types/admin-receipt';

const TRANSACTION_HASH_PATTERN = /^[a-fA-F0-9]{64}$/;
const FAILURE_CODE_PATTERN = /^[A-Z0-9][A-Z0-9_.:-]{0,63}$/;
const POSITIVE_AMOUNT_PATTERN = /^(?:0*[1-9]\d*)(?:\.\d+)?$|^0*\.\d*[1-9]\d*$/;

const EXPLORER_TRANSACTION_BASES: Readonly<Record<string, string>> = {
  [Networks.PUBLIC]: 'https://stellar.expert/explorer/public/tx',
  [Networks.TESTNET]: 'https://stellar.expert/explorer/testnet/tx',
  [Networks.FUTURENET]: 'https://stellar.expert/explorer/futurenet/tx',
};

const STATUS_ALIASES: Readonly<Record<string, AdminActionStatus>> = {
  SUCCESS: 'success',
  CONFIRMED: 'success',
  PENDING: 'pending',
  DUPLICATE: 'pending',
  NOT_FOUND: 'pending',
  FAILED: 'failed',
  ERROR: 'failed',
  TRY_AGAIN_LATER: 'unknown',
  UNKNOWN: 'unknown',
};

const OPERATION_LABELS: Readonly<
  Record<AdminActionReceiptInput['operation'], string>
> = {
  'whitelist-add': 'Whitelist addition',
  'whitelist-remove': 'Whitelist removal',
  'asset-register': 'Asset registration',
  'protocol-pause': 'Protocol pause',
  'protocol-unpause': 'Protocol unpause',
  'asset-mint': 'Asset mint',
};

const STATUS_LABELS: Readonly<Record<AdminActionStatus, string>> = {
  success: 'confirmed',
  pending: 'is pending confirmation',
  failed: 'failed',
  unknown: 'has an unknown outcome',
};

/**
 * Maps SDK and Soroban RPC transaction states to the stable receipt status model.
 * Unrecognised values remain `unknown` instead of being presented as successful.
 */
export function normalizeAdminActionStatus(
  status: AdminTransactionStatusInput | string,
): AdminActionStatus {
  const normalized = status.trim().toUpperCase();
  return STATUS_ALIASES[normalized] ?? 'unknown';
}

/**
 * Builds a network-aware transaction explorer URL.
 *
 * Public, Testnet, and Futurenet use Stellar Expert. Custom networks only
 * receive a link when the caller supplies an explicit HTTPS explorer base URL.
 */
export function buildAdminTransactionExplorerUrl(
  transactionHash: string | null | undefined,
  networkPassphrase: string,
  explorerBaseUrl?: string,
): string | null {
  if (!transactionHash) {
    return null;
  }

  const normalizedHash = normalizeTransactionHash(transactionHash);
  const standardBase = EXPLORER_TRANSACTION_BASES[networkPassphrase];
  const base = standardBase ?? normalizeCustomExplorerBase(explorerBaseUrl);

  return base ? `${base}/${normalizedHash}` : null;
}

/**
 * Creates a serialisable, UI-facing admin receipt from a deliberately narrow
 * input model. Raw RPC responses, signatures, secrets, and arbitrary metadata
 * are not copied into the returned receipt.
 */
export function buildAdminActionReceipt<TInput extends AdminActionReceiptInput>(
  input: TInput,
): AdminActionReceipt<TInput> {
  validateTarget(input);

  const status = normalizeAdminActionStatus(input.status);
  const transactionHash = input.transactionHash
    ? normalizeTransactionHash(input.transactionHash)
    : null;

  if (status === 'success' && !transactionHash) {
    throw new AdminReceiptError(
      'MISSING_TRANSACTION_HASH',
      'A successful admin action receipt requires a transaction hash.',
    );
  }

  const observedAt = normalizeObservedAt(input.observedAt);
  const failureCode = normalizeFailureCode(input.failureCode);

  const receipt: AdminActionReceipt<TInput> = {
    operation: input.operation,
    target: cloneTarget(input),
    status,
    transactionHash,
    explorerUrl: buildAdminTransactionExplorerUrl(
      transactionHash,
      input.networkPassphrase,
      input.explorerBaseUrl,
    ),
    observedAt,
    summary: `${OPERATION_LABELS[input.operation]} ${STATUS_LABELS[status]}.`,
    ...(failureCode ? { failureCode } : {}),
  };

  return Object.freeze(receipt);
}

function normalizeTransactionHash(transactionHash: string): string {
  const normalizedHash = transactionHash.trim().toLowerCase();
  if (!TRANSACTION_HASH_PATTERN.test(normalizedHash)) {
    throw new AdminReceiptError(
      'INVALID_TRANSACTION_HASH',
      'Transaction hash must contain exactly 64 hexadecimal characters.',
    );
  }
  return normalizedHash;
}

function normalizeCustomExplorerBase(explorerBaseUrl?: string): string | null {
  if (!explorerBaseUrl) {
    return null;
  }

  try {
    const parsed = new URL(explorerBaseUrl);
    if (parsed.protocol !== 'https:') {
      throw new Error('Explorer URL must use HTTPS.');
    }
    return parsed.toString().replace(/\/+$/, '');
  } catch {
    throw new AdminReceiptError(
      'INVALID_EXPLORER_URL',
      'Custom explorer base URL must be a valid HTTPS URL.',
    );
  }
}

function normalizeObservedAt(observedAt?: Date | string): string {
  const date =
    observedAt instanceof Date
      ? observedAt
      : new Date(observedAt ?? Date.now());
  if (Number.isNaN(date.getTime())) {
    throw new AdminReceiptError(
      'INVALID_TIMESTAMP',
      'Receipt timestamp must be a valid date.',
    );
  }
  return date.toISOString();
}

function normalizeFailureCode(failureCode?: string): string | undefined {
  if (!failureCode) {
    return undefined;
  }

  const normalized = failureCode.trim().toUpperCase();
  if (!FAILURE_CODE_PATTERN.test(normalized)) {
    throw new AdminReceiptError(
      'INVALID_FAILURE_CODE',
      'Failure code must be 1-64 safe uppercase identifier characters.',
    );
  }
  return normalized;
}

function validateTarget(input: AdminActionReceiptInput): void {
  const requireValue = (value: string, field: string): void => {
    if (!value || !value.trim()) {
      throw new AdminReceiptError('INVALID_TARGET', `${field} is required.`);
    }
  };

  switch (input.operation) {
    case 'whitelist-add':
    case 'whitelist-remove':
      requireValue(input.target.address, 'Whitelist address');
      return;
    case 'asset-register':
      requireValue(input.target.assetId, 'Asset identifier');
      return;
    case 'protocol-pause':
    case 'protocol-unpause':
      requireValue(input.target.contractId, 'Contract identifier');
      return;
    case 'asset-mint':
      requireValue(input.target.assetId, 'Asset identifier');
      requireValue(input.target.recipient, 'Mint recipient');
      if (!POSITIVE_AMOUNT_PATTERN.test(input.target.amount.trim())) {
        throw new AdminReceiptError(
          'INVALID_AMOUNT',
          'Mint amount must be a positive decimal string.',
        );
      }
  }
}

function cloneTarget<TInput extends AdminActionReceiptInput>(
  input: TInput,
): TInput['target'] {
  return Object.freeze({ ...input.target }) as TInput['target'];
}
