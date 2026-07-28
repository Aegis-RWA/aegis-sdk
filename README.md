#  Aegis SDK

The official TypeScript SDK for the **Aegis RWA Protocol**. This library provides a clean, class-based interface to interact with Aegis Soroban smart contracts on the Stellar network.

##  Installation

```bash
npm install @aegis/sdk
```

## Quickstart
Initialize the client and query the compliance module.
```TypeScipt
import { AegisClient } from '@aegis/sdk';
import { Networks, Keypair } from '@stellar/stellar-sdk';

const adminKeypair = Keypair.fromSecret('S...');

const aegis = new AegisClient({
  rpcUrl: '[https://soroban-testnet.stellar.org:443](https://soroban-testnet.stellar.org:443)',
  networkPassphrase: Networks.TESTNET,
  contractId: 'C_YOUR_CONTRACT_ID',
  keypair: adminKeypair // Optional for read-only calls
});

async function main() {
  // Check if a user is KYC compliant
  const isApproved = await aegis.compliance.checkWhitelist('G_USER_PUBLIC_KEY');
  console.log('Is User Whitelisted?', isApproved);
}

main();
```
## Testing
To run the SDK unit tests locally:
```
npm run test
```

For predictable responses in dashboard or unit tests without live RPC, use the local mock client:

```typescript
import { createMockAegisClient, createMockFixtures } from '@aegis/sdk/testing';
```

See [Testing Utilities](./docs/testing.md) for fixtures, transaction receipts, and export details.

## Contributing
We welcome contributions! Please check our CONTRIBUTING.md for our branching strategy and code style guidelines.