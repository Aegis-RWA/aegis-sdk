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

## Admin action receipts

Build typed, network-aware receipts for whitelist updates, asset registration,
pause actions, and minting without exposing raw RPC response data:

```TypeScript
import { Networks } from '@stellar/stellar-sdk';
import { buildAdminActionReceipt } from '@aegis/sdk';

const receipt = buildAdminActionReceipt({
  operation: 'protocol-pause',
  target: { contractId: 'C_YOUR_CONTRACT_ID' },
  status: 'SUCCESS',
  transactionHash: 'a'.repeat(64),
  networkPassphrase: Networks.TESTNET,
});

console.log(receipt.status);
console.log(receipt.explorerUrl);
```

See [Admin action receipts](docs/admin-action-receipts.md) for the complete
status mapping, custom-network behavior, and data-handling guarantees.

## Testing
To run the SDK unit tests locally:
```
npm run test
```

## Contributing
We welcome contributions! Please check our CONTRIBUTING.md for our branching strategy and code style guidelines.
