export type RoleErrorCode = 'RPC_FAILURE' | 'INVALID_ADDRESS' | 'COMPLIANCE_ERROR';

/**
 * Custom error class for role discovery and capability check operations.
 *
 * Note: `RoleModule` itself follows the SDK's safe read-model pattern (like
 * `InvestorModule`) and returns typed result objects with a `code` instead of
 * throwing on expected failure modes (invalid address, RPC failure). This class is
 * provided for consumers who want to build a stricter, throwing wrapper on top.
 */
export class RoleError extends Error {
  public readonly code: RoleErrorCode;
  public readonly cause?: Error;

  constructor(message: string, code: RoleErrorCode, cause?: Error) {
    super(message);
    this.name = 'RoleError';
    this.code = code;
    this.cause = cause;
    Object.setPrototypeOf(this, RoleError.prototype);
  }
}
