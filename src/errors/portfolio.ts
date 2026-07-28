export type PortfolioErrorCode =
  | 'RPC_FAILURE'
  | 'PARSE_ERROR'
  | 'COMPLIANCE_ERROR'
  | 'UNAVAILABLE'
  | 'INVALID_ADDRESS';

/**
 * Custom error class for investor portfolio operations.
 */
export class PortfolioError extends Error {
  public readonly code: PortfolioErrorCode;
  public readonly cause?: Error;

  constructor(message: string, code: PortfolioErrorCode, cause?: Error) {
    super(message);
    this.name = 'PortfolioError';
    this.code = code;
    this.cause = cause;
    Object.setPrototypeOf(this, PortfolioError.prototype);
  }
}
