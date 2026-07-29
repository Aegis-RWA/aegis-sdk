# Contributor Test Matrix

Use this matrix to choose the minimum useful test evidence for Aegis SDK changes. The goal is to make every feature area reviewable without requiring live RPC access for ordinary unit tests.

## Matrix by Feature Area

| Feature area | Unit tests | Fixtures or mocks | Smoke checks | Integration notes |
| --- | --- | --- | --- | --- |
| Compliance checks | Map whitelist, accreditation, blocked-address, and transfer-eligibility responses into typed SDK results. | Use mock compliance responses for approved, denied, malformed, and unknown addresses. | Verify exported compliance helpers remain reachable from the package entry point. | Live contract/RPC verification is optional unless the PR changes invocation wiring. |
| RWA asset metadata | Normalize complete metadata, optional fields, document references, and invalid required fields. | Keep reusable fixtures for valid asset, missing optional fields, bad document URI, and unsupported schema versions. | Confirm metadata helpers build and export after TypeScript compilation. | Use integration tests only when metadata is fetched from a real contract or registry endpoint. |
| Admin actions | Cover role-gated action builders, signed transaction creation, and receipt parsing. | Mock admin, issuer, and unauthorized signer contexts; never use real secrets in fixtures. | Confirm admin modules are exported and unsafe logging is absent from sample output. | Add integration coverage only when transaction assembly or Soroban simulation changes. |
| Investor reads | Cover portfolio balances, subscription status, claimable amounts, and empty-result behavior. | Use fixtures for active investor, unknown investor, zero-balance investor, and stale RPC response. | Confirm read methods can be imported without requiring a signer. | Integration tests should prove read-only calls do not require wallet state. |
| Transaction receipts | Decode known event topics, failed transactions, pending status, and unknown-topic fallback data. | Store small event fixtures with tx hash, ledger, topic, and value shapes. | Confirm package smoke tests exercise receipt exports. | Add integration coverage when polling, explorer links, or RPC status mapping changes. |
| Typed SDK errors | Preserve error codes, messages, causes, and safe diagnostics for contract/RPC failures. | Include fixtures for known contract error, network error, malformed response, and unknown nested error. | Confirm public error classes are exported from the package entry point. | Integration tests are useful only when external libraries change thrown error shapes. |

## Test Type Expectations

- **Unit tests:** Required for every runtime behavior change. Keep them deterministic and avoid live RPC.
- **Fixture tests:** Required when the feature consumes structured contract, event, receipt, or metadata payloads.
- **Smoke tests:** Required when exports, package entry points, or build artifacts change.
- **Integration tests:** Required only when the PR changes live RPC wiring, transaction assembly, or compatibility with generated contract clients.

## Fixture Guidance

Fixtures should be small, named by scenario, and safe to commit. They must not contain private keys, user secrets, real KYC data, or production wallet balances. Prefer synthetic Stellar public keys and minimal event payloads that prove the parser or mapper behavior.

## Contributor Checklist

Before requesting review, include:

- [ ] The feature area from this matrix.
- [ ] The unit test files added or updated.
- [ ] The fixture scenarios covered, if structured payloads changed.
- [ ] The smoke command or export check used, if public exports changed.
- [ ] The integration-test justification, either added or explicitly not needed.
- [ ] The exact local command output for the focused tests and release gate.

## Examples

- A new compliance denial mapper should include approved and denied unit tests, fixtures for malformed responses, and a package export smoke check if the mapper is public.
- A metadata parser update should include complete and partial metadata fixtures plus a negative test for invalid required fields.
- A transaction receipt change should include known-event, failed-transaction, and unknown-topic tests so dashboards can preserve safe fallback data.