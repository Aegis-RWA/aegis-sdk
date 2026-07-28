import { Keypair } from '@stellar/stellar-sdk';
import { AssetMetadata } from '../types/portfolio';

/**
 * Placeholder contract ID for local tests. Not a live deployment.
 */
export const MOCK_CONTRACT_ID =
  'CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABSC4';

/**
 * Secondary placeholder contract ID for multi-asset portfolio tests.
 */
export const MOCK_SECONDARY_CONTRACT_ID =
  'CBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB';

/**
 * Default asset metadata returned by the mock client.
 */
export const DEFAULT_MOCK_ASSET_METADATA: AssetMetadata = {
  symbol: 'AEGIS-RWA',
  name: 'Aegis Tokenized Real Estate',
  decimals: 7,
  isRwa: true,
  category: 'Real Estate',
  contractId: MOCK_CONTRACT_ID,
};

/**
 * Deterministic fake transaction hash prefix. Hashes are not from a live network.
 */
export const MOCK_TX_HASH_PREFIX = 'mock_tx_';

export interface MockFixtureSet {
  contractId: string;
  signer: Keypair;
  investorAddress: string;
  secondaryInvestorAddress: string;
}

/**
 * Creates a fresh set of fake keypairs and addresses for tests or examples.
 * Generated secrets are ephemeral and must not be used on mainnet.
 */
export function createMockFixtures(): MockFixtureSet {
  const signer = Keypair.random();
  const investor = Keypair.random();
  const secondaryInvestor = Keypair.random();

  return {
    contractId: MOCK_CONTRACT_ID,
    signer,
    investorAddress: investor.publicKey(),
    secondaryInvestorAddress: secondaryInvestor.publicKey(),
  };
}

/**
 * Builds a predictable mock transaction hash for assertions.
 */
export function buildMockTxHash(sequence: number, type: 'mint' | 'transfer'): string {
  return `${MOCK_TX_HASH_PREFIX}${type}_${sequence}`;
}
