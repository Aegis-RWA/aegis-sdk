import { AegisClient } from '../src/client';
import { Keypair, Networks } from '@stellar/stellar-sdk';

describe('AegisClient Configuration', () => {
  it('should initialize correctly with valid parameters', () => {
    const client = new AegisClient({
      rpcUrl: 'https://soroban-testnet.stellar.org:443',
      networkPassphrase: Networks.TESTNET,
      contractId: 'C...' // Mock Contract ID
    });

    expect(client.rpcServer).toBeDefined();
    expect(client.contractId).toBe('C...');
    expect(client.compliance).toBeDefined();
    expect(client.asset).toBeDefined();
  });

  it('should throw an error when attempting a write operation without a keypair', () => {
    const client = new AegisClient({
      rpcUrl: 'https://soroban-testnet.stellar.org:443',
      networkPassphrase: Networks.TESTNET,
      contractId: 'C...'
    });

    expect(() => {
      client.requireSigner();
    }).toThrow("Transaction signing requires a Keypair");
  });
});