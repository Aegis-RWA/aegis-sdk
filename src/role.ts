import { AegisClient } from './client';
import {
  RoleDiscoveryResult,
  RoleName,
  CapabilityName,
  CapabilityCheckResult,
  CapabilityMatrix,
} from './types/role';

const ALL_CAPABILITIES: CapabilityName[] = [
  'view_portfolio',
  'receive_transfer',
  'initiate_transfer',
  'mint_asset',
];

/**
 * Role discovery and capability checks for the Aegis SDK.
 *
 * SECURITY / COMPLIANCE NOTE: The Aegis Soroban contract does not currently expose a
 * role query function. Every result produced by this module is derived client-side
 * from `ComplianceModule.checkWhitelist()` (on-chain KYC/whitelist status) and whether
 * the configured `AegisClient` holds a signing `Keypair` for the address in question.
 *
 * This module is a developer-experience and dashboard-gating convenience — for example,
 * deciding whether to show a "Mint" button or a "Not whitelisted" banner. It is not
 * on-chain authorization, must never be presented to end users as legal, financial, or
 * compliance advice, and must never be relied upon as the sole check before submitting
 * a state-changing transaction. The contract is always the final authority on whether a
 * transaction succeeds.
 */
export class RoleModule {
  private client: AegisClient;

  constructor(client: AegisClient) {
    this.client = client;
  }

  /**
   * Discovers the SDK-derived role classification for an address.
   *
   * Only `investor` / `unauthorized` / `unknown` are currently discoverable, based on
   * whitelist status. `admin` / `issuer` classification requires a contract-side role
   * query that does not yet exist in the Aegis protocol (see class-level note above).
   *
   * @param address Stellar public key to classify.
   */
  public async discoverRole(address: string): Promise<RoleDiscoveryResult> {
    const discoveredAt = new Date().toISOString();

    if (!this.isValidAddress(address)) {
      return {
        address: address || '',
        role: 'unknown',
        isKycApproved: false,
        hasLocalSigner: false,
        reason: 'Invalid or empty address provided.',
        code: 'INVALID_ADDRESS',
        discoveredAt,
      };
    }

    const hasLocalSigner = this.addressMatchesLocalSigner(address);

    try {
      const isKycApproved = await this.client.compliance.checkWhitelist(address);
      const role: RoleName = isKycApproved ? 'investor' : 'unauthorized';

      return {
        address,
        role,
        isKycApproved,
        hasLocalSigner,
        code: 'OK',
        discoveredAt,
      };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      return {
        address,
        role: 'unknown',
        isKycApproved: false,
        hasLocalSigner,
        reason: `Compliance status query failed: ${errorMsg}`,
        code: 'COMPLIANCE_QUERY_FAILED',
        discoveredAt,
      };
    }
  }

  /**
   * Evaluates a single capability for an address.
   *
   * `view_portfolio` is unrestricted (read-only). `mint_asset` only confirms a signer
   * is configured — issuer/admin authorization is enforced by the contract, not
   * discoverable here (see class-level note). `receive_transfer` and
   * `initiate_transfer` are gated on whitelist status, matching the eligibility logic
   * already used by `InvestorModule`.
   */
  public async checkCapability(
    address: string,
    capability: CapabilityName
  ): Promise<CapabilityCheckResult> {
    if (!this.isValidAddress(address)) {
      return {
        capability,
        isPermitted: false,
        verified: false,
        reason: 'Invalid or empty address provided.',
        code: 'INVALID_ADDRESS',
      };
    }

    const hasLocalSigner = this.addressMatchesLocalSigner(address);

    switch (capability) {
      case 'view_portfolio':
        return { capability, isPermitted: true, verified: false, code: 'OK' };

      case 'mint_asset':
        return hasLocalSigner
          ? {
              capability,
              isPermitted: true,
              verified: false,
              reason:
                'Signer configured. On-chain issuer/admin authorization is enforced ' +
                'by the contract, not verifiable by the SDK.',
              code: 'OK',
            }
          : {
              capability,
              isPermitted: false,
              verified: false,
              reason: 'No signing Keypair configured on the AegisClient.',
              code: 'NO_SIGNER_CONFIGURED',
            };

      case 'receive_transfer':
      case 'initiate_transfer': {
        let isKycApproved: boolean;
        try {
          isKycApproved = await this.client.compliance.checkWhitelist(address);
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : String(error);
          return {
            capability,
            isPermitted: false,
            verified: false,
            reason: `Compliance status query failed: ${errorMsg}`,
            code: 'COMPLIANCE_QUERY_FAILED',
          };
        }

        if (!isKycApproved) {
          return {
            capability,
            isPermitted: false,
            verified: false,
            reason: 'Address is not KYC/whitelist approved.',
            code: 'NOT_WHITELISTED',
          };
        }

        if (capability === 'initiate_transfer' && !hasLocalSigner) {
          return {
            capability,
            isPermitted: false,
            verified: false,
            reason: 'No signing Keypair configured on the AegisClient for this address.',
            code: 'NO_SIGNER_CONFIGURED',
          };
        }

        return { capability, isPermitted: true, verified: false, code: 'OK' };
      }

      default:
        return {
          capability,
          isPermitted: false,
          verified: false,
          reason: `Unknown capability: ${capability}`,
          code: 'INVALID_ADDRESS',
        };
    }
  }

  /**
   * Evaluates every known capability for an address in one call — convenient for
   * gating dashboard UI without issuing one round trip per capability.
   */
  public async getCapabilityMatrix(address: string): Promise<CapabilityMatrix> {
    const evaluatedAt = new Date().toISOString();
    const capabilities = await Promise.all(
      ALL_CAPABILITIES.map((capability) => this.checkCapability(address, capability))
    );

    return { address, capabilities, evaluatedAt };
  }

  private isValidAddress(address: string): boolean {
    return typeof address === 'string' && address.length > 0;
  }

  private addressMatchesLocalSigner(address: string): boolean {
    if (!this.client.keypair) return false;
    try {
      return this.client.keypair.publicKey() === address;
    } catch {
      return false;
    }
  }
}
