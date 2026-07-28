import { AegisClient, AegisClientConfig } from '../../src';

const config: AegisClientConfig = {
  rpcUrl: 'https://soroban-testnet.stellar.org',
  networkPassphrase: 'Test SDF Network ; September 2015',
  contractId: 'CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABSC4',
};

const client = new AegisClient(config);

if (!client.compliance || !client.asset || !client.investor) {
  throw new Error('AegisClient did not initialize all public modules.');
}

if (typeof globalThis === 'undefined') {
  throw new Error('The browser runtime must provide globalThis.');
}

try {
  client.requireSigner();
  throw new Error('Read-only browser clients must not expose an implicit signer.');
} catch (error) {
  if (!(error instanceof Error) || !error.message.includes('requires a Keypair')) {
    throw error;
  }
}

export const browserCompatibilityProbe = {
  contractId: client.contractId,
  hasComplianceModule: Boolean(client.compliance),
  hasAssetModule: Boolean(client.asset),
  hasInvestorModule: Boolean(client.investor),
};
