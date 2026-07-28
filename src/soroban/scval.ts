import { Address, xdr, scValToNative } from '@stellar/stellar-sdk';
import { EventDecodeError } from '../errors/event';

/**
 * Decodes a Soroban ScVal from base64 XDR or a parsed ScVal instance.
 */
export function decodeScVal(input: string | xdr.ScVal): unknown {
  if (input instanceof xdr.ScVal) {
    return scValToNative(input);
  }

  if (!input || typeof input !== 'string') {
    throw new EventDecodeError('INVALID_EVENT_INPUT', 'ScVal input must be a base64 string or xdr.ScVal.');
  }

  try {
    return scValToNative(xdr.ScVal.fromXDR(input, 'base64'));
  } catch {
    throw new EventDecodeError('VALUE_DECODE_FAILED', 'Failed to decode Soroban ScVal from base64 XDR.');
  }
}

/**
 * Decodes the first topic entry as an event name symbol/string.
 */
export function decodeEventName(topic: string | xdr.ScVal): string | null {
  try {
    const native = decodeScVal(topic);
    if (typeof native === 'string') {
      return native;
    }
    if (native && typeof native === 'object' && 'toString' in native) {
      return String(native);
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Normalises a decoded address-like value to a Stellar public key string.
 */
export function normalizeAddress(value: unknown): string | null {
  if (typeof value === 'string' && value.trim()) {
    return value.trim();
  }

  if (value instanceof Address) {
    return value.toString();
  }

  if (value && typeof value === 'object') {
    if ('toString' in value && typeof (value as { toString: () => string }).toString === 'function') {
      const rendered = (value as { toString: () => string }).toString();
      if (rendered && rendered !== '[object Object]') {
        return rendered;
      }
    }
  }

  return null;
}

/**
 * Normalises numeric event fields to raw integer strings for audit views.
 */
export function normalizeAmount(value: unknown): string | null {
  if (typeof value === 'bigint') {
    return value.toString();
  }
  if (typeof value === 'number' && Number.isFinite(value)) {
    return Math.trunc(value).toString();
  }
  if (typeof value === 'string' && value.trim()) {
    return value.trim();
  }
  return null;
}

/**
 * Reads a field from a decoded struct/map-like payload.
 */
export function readPayloadField(
  payload: unknown,
  field: string
): unknown {
  if (!payload || typeof payload !== 'object') {
    return undefined;
  }

  if (Array.isArray(payload)) {
    return undefined;
  }

  return (payload as Record<string, unknown>)[field];
}
