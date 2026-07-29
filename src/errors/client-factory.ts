import { ClientRole } from '../types/client-factory';

export type RoleCapabilityErrorCode =
  | 'OPERATION_NOT_PERMITTED'
  | 'SIGNER_REQUIRED';

/**
 * Thrown when a caller invokes an operation that is not permitted for the
 * client's declared role.
 *
 * For example, calling `mint()` on an investor client throws this error with
 * code `OPERATION_NOT_PERMITTED`, because minting requires the `issuer` or
 * `admin` role.
 */
export class RoleCapabilityError extends Error {
  public readonly code: RoleCapabilityErrorCode;
  public readonly role: ClientRole;
  public readonly operation: string;

  constructor(
    message: string,
    code: RoleCapabilityErrorCode,
    role: ClientRole,
    operation: string,
  ) {
    super(message);
    this.name = 'RoleCapabilityError';
    this.code = code;
    this.role = role;
    this.operation = operation;
    Object.setPrototypeOf(this, RoleCapabilityError.prototype);
  }
}
