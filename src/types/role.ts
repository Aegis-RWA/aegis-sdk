/**
 * SDK-derived classification of an address's standing with respect to the Aegis protocol.
 *
 * IMPORTANT: This classification is derived entirely from information observable
 * client-side — KYC/whitelist status via `ComplianceModule.checkWhitelist()`, and
 * whether the configured `AegisClient` holds a signing `Keypair` for the address in
 * question. It is NOT a contract-verified on-chain role. The Aegis Soroban contract
 * does not currently expose a role query function (e.g. `get_role`, `is_admin`), so
 * `admin` and `issuer` roles cannot be discovered by this SDK until one exists.
 *
 * Treat this as a UX/dashboard convenience for gating what to *show*, never as an
 * authorization check for what to *allow* — the contract remains the sole source of
 * truth for whether a transaction is actually permitted.
 */
export type RoleName = 'investor' | 'unauthorized' | 'unknown';

export type RoleDiscoveryCode = 'OK' | 'INVALID_ADDRESS' | 'COMPLIANCE_QUERY_FAILED';

/**
 * Result of an `RoleModule.discoverRole()` call.
 */
export interface RoleDiscoveryResult {
  address: string;
  role: RoleName;
  isKycApproved: boolean;
  /** True if the configured `AegisClient.keypair` matches this address. */
  hasLocalSigner: boolean;
  reason?: string;
  code: RoleDiscoveryCode;
  discoveredAt: string;
}

/**
 * A capability the SDK can evaluate for a given address/client configuration.
 * This list reflects what the current SDK modules expose (`compliance`, `asset`,
 * `investor`) — it is not an exhaustive list of everything the Aegis contract can do.
 */
export type CapabilityName =
  | 'view_portfolio'
  | 'receive_transfer'
  | 'initiate_transfer'
  | 'mint_asset';

export type CapabilityCheckCode =
  | 'OK'
  | 'NOT_WHITELISTED'
  | 'NO_SIGNER_CONFIGURED'
  | 'COMPLIANCE_QUERY_FAILED'
  | 'INVALID_ADDRESS';

/**
 * Result of a single capability evaluation.
 *
 * `verified` is always `false` in the current SDK: every result here is a client-side
 * prediction based on whitelist status and local signer configuration, not a contract
 * simulation. Callers that need a hard guarantee must still simulate/submit the actual
 * transaction (see `AssetModule`) — the contract is the final authority.
 */
export interface CapabilityCheckResult {
  capability: CapabilityName;
  isPermitted: boolean;
  verified: boolean;
  reason?: string;
  code: CapabilityCheckCode;
}

/**
 * Every known capability evaluated for a single address in one call — convenient for
 * gating dashboard UI in one round trip.
 */
export interface CapabilityMatrix {
  address: string;
  capabilities: CapabilityCheckResult[];
  evaluatedAt: string;
}
