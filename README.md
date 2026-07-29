#  Aegis SDK

The official TypeScript SDK for the **Aegis RWA Protocol**. This library provides a clean, class-based interface to interact with Aegis Soroban smart contracts on the Stellar network.

##  Installation

```bash
npm install @aegis/sdk
```

## Quickstart
Initialize the client with a typed environment preset and query the compliance module.
This is a **read-only** call — no signing keypair is needed or used here.
```TypeScript
import { AegisClient } from '@aegis/sdk';

const aegis = new AegisClient({
  environment: 'testnet', // or 'local'; see docs/environments.md
  contractId: 'C_YOUR_CONTRACT_ID',
});

async function main() {
  // Check if a user is KYC compliant
  const isApproved = await aegis.compliance.checkWhitelist('G_USER_PUBLIC_KEY');
  console.log('Is User Whitelisted?', isApproved);
}

main();
```

## Privileged Operations (Admin / Issuer)
⚠️ **`mint` and `transfer` are privileged, state-changing operations.** They require an
`AegisClient` configured with a signing `keypair`, and that keypair's authority is
whatever the deployed contract grants it (typically issuer/admin authority for `mint`).
Never hardcode a real secret key in source code. Load it from an environment variable
or secret manager that is excluded from version control — the string below is a
placeholder, not something to paste a real secret into.
```TypeScript
import { AegisClient } from '@aegis/sdk';
import { Keypair } from '@stellar/stellar-sdk';

// NEVER hardcode a real secret key. Load it from a secret manager or an
// environment variable that is git-ignored (e.g. via a local .env file).
const issuerKeypair = Keypair.fromSecret(process.env.AEGIS_ISSUER_SECRET!);

const aegis = new AegisClient({
  environment: 'testnet',
  contractId: 'C_YOUR_CONTRACT_ID',
  keypair: issuerKeypair, // required for mint/transfer; omit for read-only usage
});

async function mintExample() {
  const txHash = await aegis.asset.mint('G_RECIPIENT_PUBLIC_KEY', 1000);
  console.log('Mint submitted, tx hash:', txHash);
}

mintExample();
```
See [API Reference: `AssetModule`](docs/api-reference.md#assetmodule) for the open
caveats (sequence-number placeholder, no pre-submission simulation) before using this
against a real account.
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

Before submitting a PR, follow our [Test-First Contribution Guide](docs/test-first-contribution-guide.md) to understand when tests are required, what type of tests are expected per module, and how to prove your change works correctly.

### Review Process
PRs submitted to this repository are reviewed against our [Pull Request Reviewer Checklist](docs/reviewer-checklist.md), which covers code implementation, unit test coverage, CI build compatibility, API reference documentation, security/compliance, and acceptance criteria.

### Acceptance Criteria Traceability
Every PR **must** include an [acceptance criteria traceability table](docs/acceptance-criteria-traceability.md) that maps SDK modules, tests, docs, and behaviour verification to each acceptance criterion from the linked issue. This makes evaluation straightforward for maintainers and GrantFox reviewers.

