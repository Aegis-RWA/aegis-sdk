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

## Network failure handling

SDK network operations expose stable, redacted failure codes and safe support
diagnostics:

```TypeScript
import { NetworkFailure } from '@aegis/sdk';

try {
  await client.compliance.checkWhitelist('G...');
} catch (error) {
  if (error instanceof NetworkFailure) {
    console.log(error.code);
    console.log(error.retryable);
  }
}
```

See [Network failure handling](docs/network-failures.md) for the complete
classification and diagnostics model.

## Testing
To run the SDK unit tests locally:
```
npm run test
```

## Contributing
We welcome contributions! Please check our CONTRIBUTING.md for our branching strategy and code style guidelines.
