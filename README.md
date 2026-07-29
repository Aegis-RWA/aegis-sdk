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

## Contract Event Decoder
Decode Soroban contract events into typed audit-trail models for dashboards and indexers.

```typescript
import { decodeContractEvent } from '@aegis/sdk';

const event = decodeContractEvent({
  topic: rpcEvent.topic,
  value: rpcEvent.value,
  txHash: rpcEvent.txHash,
});

if (event.kind === 'transfer') {
  console.log(event.from, event.to, event.amount);
}
```

See [Contract Event Decoder](./docs/contract-events.md) for supported topics, unknown fallback behaviour, and dashboard integration guidance.

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

### Pre-submit verification

Run all checks (lint, format, build, test, compat) in a single command before
submitting a PR:

```bash
npm run verify
```

See [Test-First Contribution Guide](docs/test-first-contribution.md) for when behavior changes need happy-path, negative-path, and no-test justification coverage.

See [Verification Command](docs/verification.md) for detailed usage and
troubleshooting guidance.

See [Runtime Compatibility](docs/runtime-compatibility.md) for the supported
environments, what the automated probes cover, and integration guidance.

For step-by-step instructions on reproducing and fixing CI check failures, see the [CI Resolution Workflow](docs/ci-resolution-workflow.md).

## Contributing
We welcome contributions! Please check our [CONTRIBUTING.md](CONTRIBUTING.md) for our branching strategy and code style guidelines.

### Review Process
PRs submitted to this repository are reviewed against our [Pull Request Reviewer Checklist](docs/reviewer-checklist.md), which covers code implementation, unit test coverage, CI build compatibility, API reference documentation, security/compliance, and acceptance criteria.

### Acceptance Criteria Traceability
Every PR **must** include an [acceptance criteria traceability table](docs/acceptance-criteria-traceability.md) that maps SDK modules, tests, docs, and behaviour verification to each acceptance criterion from the linked issue. This makes evaluation straightforward for maintainers and GrantFox reviewers.

