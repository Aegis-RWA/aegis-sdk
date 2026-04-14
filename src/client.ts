import { rpc, Keypair, Networks } from '@stellar/stellar-sdk';
import { ComplianceModule } from './compliance';
import { AssetModule } from './asset';

export interface AegisClientConfig {
rpcUrl: string;
networkPassphrase: string;
contractId: string;
keypair?: Keypair; // Optional: If not provided, client is read-only
}

export class AegisClient {
public rpcServer: rpc.Server;
public contractId: string;
public networkPassphrase: string;
public keypair?: Keypair;

// Modules
public compliance: ComplianceModule;
public asset: AssetModule;

/**
* Initializes the Aegis RWA SDK Client.
* @param config AegisClientConfig object
*/
constructor(config: AegisClientConfig) {
    this.rpcServer = new rpc.Server(config.rpcUrl);
    this.contractId = config.contractId;
    this.networkPassphrase = config.networkPassphrase;

    // TODO: Add support for browser-based wallet providers (Freighter/Albedo)
    this.keypair = config.keypair;

    this.compliance = new ComplianceModule(this);
    this.asset = new AssetModule(this);
  }

  /**
   * Helper to verify the client is configured for write operations.
   */
  public requireSigner(): Keypair {
    if (!this.keypair) {
      throw new Error("Transaction signing requires a Keypair to be configured on the AegisClient.");
    }
    return this.keypair;
  }
}