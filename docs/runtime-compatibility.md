# Runtime compatibility

The Aegis SDK supports modern Node.js applications and browser applications
that use an ESM-aware bundler. Runtime compatibility is part of the release
gate rather than an assumption made by downstream integrators.

## Supported environments

| Environment | Supported baseline | Signing model |
| --- | --- | --- |
| Node.js | Node 20 and newer | `Keypair` supplied to `AegisClient` |
| Browser | ES2020-capable browsers through a bundler | Read-only client today; use a wallet adapter when one is explicitly configured |

The browser build must not silently pull in Node-only modules such as `fs`,
`net`, or `child_process`. The SDK also does not manufacture or persist wallet
credentials. A browser client created without a signer remains read-only and
`requireSigner()` fails explicitly.

## Automated compatibility gate

Run:

```bash
npm run test:compat
```

The gate performs two independent probes:

1. **Browser bundle:** esbuild resolves the public SDK entrypoint with
   `platform: browser`, browser-first export conditions, and an ES2020 target.
   The build fails on unresolved Node built-ins, and its metadata is checked for
   any external Node-only imports.
2. **Node execution:** the same public entrypoint is bundled for Node 20 and
   executed in a child process. The probe constructs a client with a generated
   test keypair and verifies that every public module and the configured signer
   are available.

Neither probe calls an RPC endpoint, submits a transaction, reads a real wallet,
or depends on a secret. They are deterministic release checks.

`npm run check` runs TypeScript compilation, the Jest suite, and both runtime
probes together. CI executes this command on Node 20 and Node 22.

## Browser integration notes

- Import from the public package entrypoint rather than internal source paths.
- Pass the network and RPC URL explicitly.
- Do not embed a secret key in browser code. Browser signing must be delegated
  to a reviewed wallet adapter.
- Treat a successful bundle as API/runtime compatibility evidence, not as proof
  that a particular RPC endpoint or wallet extension is available.

## Failure interpretation

- A browser build failure usually indicates that a dependency introduced an
  unsupported Node-only import or an incompatible export condition.
- A Node probe failure indicates that the published entrypoint, module graph, or
  signer initialization no longer works in the supported Node baseline.
- Network or wallet behavior belongs in integration tests and must not be
  hidden inside this deterministic compatibility gate.
