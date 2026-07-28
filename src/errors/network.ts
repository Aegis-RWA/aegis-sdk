export type NetworkFailureCode =
  | 'TIMEOUT'
  | 'RPC_UNAVAILABLE'
  | 'RATE_LIMITED'
  | 'INVALID_NETWORK_PASSPHRASE'
  | 'MALFORMED_RESPONSE'
  | 'UNKNOWN';

export class NetworkFailure extends Error {
  public readonly code: NetworkFailureCode;
  public readonly retryable: boolean;
  public readonly retryAfterSeconds?: number;
  public readonly cause?: unknown;

  constructor(
    message: string,
    code: NetworkFailureCode,
    retryable: boolean,
    options: {
      retryAfterSeconds?: number;
      cause?: unknown;
    } = {},
  ) {
    super(message);
    this.name = 'NetworkFailure';
    this.code = code;
    this.retryable = retryable;
    this.retryAfterSeconds = options.retryAfterSeconds;

    if (options.cause !== undefined) {
      Object.defineProperty(this, 'cause', {
        value: options.cause,
        enumerable: false,
        configurable: false,
        writable: false,
      });
    }

    Object.setPrototypeOf(this, NetworkFailure.prototype);
  }
}
