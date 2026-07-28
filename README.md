#  Aegis SDK

The official TypeScript SDK for the **Aegis RWA Protocol**. This library provides a clean, class-based interface to interact with Aegis Soroban smart contracts on the Stellar network.

##  Installation

```bash
npm install @aegis/sdk
```

## Quickstart
Initialize the client with a typed environment preset and query the compliance module.
```TypeScript
import { AegisClient } from '@aegis/sdk';
import { Keypair } from '@stellar/stellar-sdk';

const adminKeypair = Keypair.fromSecret('S...');

const aegis = new AegisClient({
  environment: 'testnet', // or 'local'; see docs/environments.md
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

Presets cover `testnet` and `local` out of the box. `mainnet` is defined but gated behind
`allowMainnet: true` until the Aegis protocol is live there. You can still pass explicit
`rpcUrl`/`networkPassphrase` values instead of `environment` if you need a fully custom
endpoint — see [docs/environments.md](./docs/environments.md) for details and validation rules.
## Testing
To run the SDK unit tests locally:
```
npm run test
```

## Contributing
We welcome contributions! Please check our CONTRIBUTING.md for our branching strategy and code style guidelines.