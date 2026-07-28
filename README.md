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
## Role Discovery & Capability Checks
Check what an address is classified as, and what it can currently attempt through the SDK.
This is a client-side convenience for UI gating, not on-chain authorization — see the
[full documentation](./docs/role-discovery.md) for important caveats.
```TypeScript
const roleResult = await aegis.role.discoverRole('G_USER_PUBLIC_KEY');
console.log('Role:', roleResult.role); // 'investor' | 'unauthorized' | 'unknown'

const capability = await aegis.role.checkCapability('G_USER_PUBLIC_KEY', 'receive_transfer');
console.log('Can receive transfer?', capability.isPermitted);
```

## Testing
To run the SDK unit tests locally:
```
npm run test
```

Run the full release gate, including TypeScript compilation and browser/Node
runtime compatibility checks:

```bash
npm run check
```

See [Runtime Compatibility](docs/runtime-compatibility.md) for the supported
environments, what the automated probes cover, and integration guidance.

## Self-Review
Before opening a PR, run through our [self-review checklist](docs/self-review-template.md) to catch common issues early.

## Contributing
We welcome contributions! Please check our CONTRIBUTING.md for our branching strategy and code style guidelines.
