export type ConfigErrorCode =
  | 'ENVIRONMENT_UNAVAILABLE'
  | 'INVALID_RPC_URL'
  | 'INVALID_NETWORK_PASSPHRASE'
  | 'INVALID_CONTRACT_ID'
  | 'MISSING_CONFIG';

/**
 * Thrown when an `AegisClient` is constructed with an invalid or unsafe configuration.
 */
export class ConfigValidationError extends Error {
  public readonly code: ConfigErrorCode;

  constructor(message: string, code: ConfigErrorCode) {
    super(message);
    this.name = 'ConfigValidationError';
    this.code = code;
    Object.setPrototypeOf(this, ConfigValidationError.prototype);
  }
}
