import { NetworkFailureCode } from '../errors/network';
import { classifyNetworkFailure } from '../network/failures';

export type NetworkRecoveryAction =
  | 'retry'
  | 'retry-with-backoff'
  | 'check-configuration'
  | 'inspect-rpc-response'
  | 'report-unknown';

export interface NetworkFailureDiagnostic {
  code: NetworkFailureCode;
  message: string;
  retryable: boolean;
  action: NetworkRecoveryAction;
  retryAfterSeconds?: number;
}

const RECOVERY_ACTIONS: Readonly<
  Record<NetworkFailureCode, NetworkRecoveryAction>
> = {
  TIMEOUT: 'retry',
  RPC_UNAVAILABLE: 'retry-with-backoff',
  RATE_LIMITED: 'retry-with-backoff',
  INVALID_NETWORK_PASSPHRASE: 'check-configuration',
  MALFORMED_RESPONSE: 'inspect-rpc-response',
  UNKNOWN: 'report-unknown',
};

/**
 * Converts a raw failure into a serialisable diagnostic safe for logs, UI, or
 * GitHub support requests. The original error and its raw message are omitted.
 */
export function buildNetworkFailureDiagnostic(
  error: unknown,
): NetworkFailureDiagnostic {
  const failure = classifyNetworkFailure(error);

  return Object.freeze({
    code: failure.code,
    message: failure.message,
    retryable: failure.retryable,
    action: RECOVERY_ACTIONS[failure.code],
    ...(failure.retryAfterSeconds !== undefined
      ? { retryAfterSeconds: failure.retryAfterSeconds }
      : {}),
  });
}
