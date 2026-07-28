import { Keypair, Networks } from '@stellar/stellar-sdk';
import { AegisClient } from '../../src';

const signer = Keypair.random();
const client = new AegisClient({
  rpcUrl: 'https://soroban-testnet.stellar.org',
  networkPassphrase: Networks.TESTNET,
  contractId: 'CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABSC4',
  keypair: signer,
});

if (client.requireSigner() !== signer) {
  throw new Error('Node client did not preserve the configured signer.');
}

if (!client.compliance || !client.asset || !client.investor) {
  throw new Error('AegisClient did not initialize all public modules.');
}

console.log('Node compatibility: public SDK entrypoint and signer initialized.');
