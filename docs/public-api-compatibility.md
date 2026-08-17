# Public API Compatibility Matrix

This page is the compatibility contract for consumers of `@aegis/sdk`. It
maps the package's public entry points to the Aegis contract interface and to
the dashboard flows that are planned to consume them.

The matrix describes `@aegis/sdk` `0.1.0` at source revision `f547e51`. Check
the package version and this page together when reviewing an upgrade. The
[API reference](api-reference.md) remains the source for complete signatures,
parameters, return values, and errors.

> **Protocol boundary:** an SDK capability only describes client behavior. It
> does not prove that a deployed contract implements the expected entrypoint,
> that the connected signer is authorized, or that a transaction will succeed.
> Compliance-related results are protocol signals, not legal or regulatory
> advice.

## Stability labels

| Label | Meaning for SDK consumers |
| --- | --- |
| **Supported** | Exported from a documented package entry point and covered by the current compatibility policy. |
| **Preview** | Publicly exported, but a documented contract, dashboard, or implementation gap makes the behavior unsafe to treat as a finished integration boundary. |
| **Testing** | Exported only from `@aegis/sdk/testing`; intended for deterministic tests, not production runtime code. |

The package is still pre-1.0. `Supported` therefore means stable within the
documented `0.1.x` line, not a promise that the API can never evolve.

## Package entry points

| Import path | Public surface | Stability | Consumer guidance |
| --- | --- | --- | --- |
| `@aegis/sdk` | `AegisClient`, role-aware client factories, modules, decoders, configuration/network helpers, receipts, public types, and typed errors | Supported, with row-level exceptions below | Use this entry point in applications and integrations. Do not import from internal `src/` paths. |
| `@aegis/sdk/testing` | `MockAegisClient`, mock modules, deterministic fixtures, and mock receipt types | Testing | Use in unit/component tests. Do not bundle this entry point into production flows. |

## Module and export matrix

| Public surface | Current methods or exports | Stability | Contract dependency | Dashboard integration targets | Compatibility notes |
| --- | --- | --- | --- | --- | --- |
| `AegisClient` | constructor, `requireSigner`, `runNetworkOperation`, `diagnoseNetworkFailure`; module properties `compliance`, `asset`, `investor`, `role`, `events` | Supported | Soroban RPC plus the configured Aegis `contractId`; `@stellar/stellar-sdk` `^12.0.0` | Dashboard SDK provider/configuration boundary and diagnostics | A signer is optional for reads and required for state-changing methods. Environment/config validation is part of the public contract. |
| Role-aware factories | `createReadOnlyClient`, `createInvestorClient`, `createComplianceOperatorClient`, `createIssuerClient`, `createAdminClient`, `getRoleCapabilities`; role-specific client interfaces | Supported | Same dependencies as `AegisClient`; factories restrict the SDK surface but do not replace contract authorization | Role-aware route and control gating | Capability exposure is a client-side guard. The contract remains authoritative for admin, issuer, compliance, and asset-manager permissions. |
| `ComplianceModule` | `checkWhitelist(address)` | Supported | `is_whitelisted(address)` | Investor onboarding, whitelist status, transfer eligibility, admin whitelist views | A successful read maps to a boolean. An unsuccessful simulation with no result also maps to `false`; callers must not interpret every `false` as a legal or final KYC decision. |
| `AssetModule` | `mint(to, amount)`, `transfer(to, amount)` | Preview | `mint_asset(admin, to, amount)` and `transfer(from, to, amount)` | Mint and transfer forms, transaction history | Both calls return the submission hash, not ledger finality. The current implementation uses a placeholder source sequence and does not simulate before submission; see the API reference before live use. |
| `InvestorModule` | `getPortfolio(investorAddress, options?)` and exported portfolio types | Preview | `is_whitelisted`; balance lookup currently invokes `balance(address)` | Investor dashboard portfolio, holdings, KYC/blocked status, transfer eligibility | The current contract specification exposes `get_balance_of(address)`, not `balance(address)`, and SDK metadata is currently a static fallback. Treat the portfolio adapter as an integration boundary that must be reconciled before production wiring. |
| `RoleModule` | `discoverRole`, `checkCapability`, `getCapabilityMatrix`; exported role/capability types and errors | Preview | `is_whitelisted`; the contract also exposes `get_role_of`, which is not wired into this SDK module | Auth/role store, route guards, capability-gated controls | The SDK can distinguish investor/unauthorized/unknown. It cannot currently verify admin or issuer roles; contract authorization remains authoritative. |
| `EventsModule` and event helpers | `decode`, `fetchAndDecode`, `decodeContractEvent(s)`, `AEGIS_EVENT_TOPICS`, topic helpers, event types/errors | Preview | Soroban RPC `getEvents`; contract event topics and payloads | Transaction/activity history, compliance audit trails, admin lifecycle views | The decoder's current topic registry includes legacy names such as `whitelist_add`, `mint`, and `protocol_pause`. The contract specification uses canonical topics such as `compliance_status_changed`, `asset_minted`, and `contract_paused`. Unknown events fall back safely by default, but canonical-topic parity is not complete. |
| Admin receipt helpers | `buildAdminActionReceipt`, `buildAdminTransactionExplorerUrl`, `normalizeAdminActionStatus`; receipt types | Supported | None; pure normalization and presentation helpers | Admin action result banners, history, explorer links | Receipts describe an observed result and do not submit or authorize a contract call. Successful receipts require a transaction hash. |
| Network/configuration helpers | `resolveClientConfig`, environment presets, `classifyNetworkFailure`, `buildNetworkFailureDiagnostic`; config/network types and errors | Supported | RPC URL, network passphrase, and configured contract ID | Client initialization, diagnostics, retry/error UI | Diagnostics are intentionally redacted. `allowMainnet` is an explicit safety gate, not proof that a deployment is production-ready. |
| Low-level decoding helpers | `decodeScVal`, `decodeEventName`, `parseSorobanResult` | Supported | Soroban XDR/value shapes | SDK adapters and event/read-model normalization | Consumers should prefer module methods when available; low-level helpers expose protocol representation details. |
| Public types and errors | client-role interfaces; portfolio, role, event, receipt, environment, and configuration types; `RoleCapabilityError`, `PortfolioError`, `RoleError`, `NetworkFailure`, `ConfigValidationError`, `EventDecodeError`, `AdminReceiptError` | Supported | Mirrors the corresponding module and protocol shapes | TypeScript adapters, state stores, error/recovery UI, and tests | Adding an optional field can be compatible; removing, renaming, or changing the meaning of a field/error code is breaking. Import these from the package root rather than internal files. |
| `@aegis/sdk/testing` | mock client/modules, fixture constants/builders, mock receipt and configuration types | Testing | None; deterministic in-memory behavior | Dashboard component and SDK consumer tests | Mock behavior is not evidence of contract compatibility. Keep production imports on `@aegis/sdk`. |

### Named root exports by area

- Client: `AegisClient`, `AegisClientConfig`.
- Factories and role-specific clients: `createReadOnlyClient`,
  `createInvestorClient`, `createComplianceOperatorClient`,
  `createIssuerClient`, `createAdminClient`, `getRoleCapabilities`, and the
  five corresponding `Aegis*Client` interfaces.
- Modules: `ComplianceModule`, `AssetModule`, `InvestorModule`, `RoleModule`,
  `EventsModule`.
- Events/XDR: `decodeContractEvent`, `decodeContractEvents`,
  `AEGIS_EVENT_TOPICS`, `isKnownAegisEventTopic`, `normalizeEventTopicName`,
  `decodeScVal`, `decodeEventName`, `parseSorobanResult`.
- Admin receipts: `buildAdminActionReceipt`,
  `buildAdminTransactionExplorerUrl`, `normalizeAdminActionStatus`.
- Network/configuration: `classifyNetworkFailure`,
  `buildNetworkFailureDiagnostic`, `NetworkFailureDiagnostic`,
  `NetworkRecoveryAction`, `resolveClientConfig`, `AEGIS_ENVIRONMENTS`,
  `getEnvironmentPreset`, `AegisEnvironmentName`, `AegisEnvironmentPreset`,
  `ResolvedAegisConfig`.
- The package root also re-exports the public client-factory, portfolio, role,
  admin-receipt, network, configuration, contract-event, and event-error types
  and errors represented in the matrix above.

## Contract compatibility snapshot

The companion contract repository is
[`Axionvera/aegis-contracts`](https://github.com/Axionvera/aegis-contracts).
Its public contract specification documents the interface this SDK is
expected to target; it is not proof that any particular deployment exposes
that interface. Verify a deployment on-chain before enabling a contract-bound
flow. At this SDK revision:

| SDK expectation | Contract specification | Status |
| --- | --- | --- |
| `ComplianceModule.checkWhitelist` calls `is_whitelisted` | `is_whitelisted(user)` is a documented pure read | Aligned |
| `AssetModule.mint` calls `mint_asset` | `mint_asset(admin, to, amount)` is documented | Entrypoint aligned; SDK submission/finality gaps remain |
| `AssetModule.transfer` calls `transfer` | `transfer(from, to, amount)` is documented | Entrypoint aligned; SDK submission/finality gaps remain |
| `InvestorModule` calls `balance(address)` | Contract read is documented as `get_balance_of(address)` | Drift: reconcile before production use |
| `RoleModule` infers roles from whitelist status | Contract exposes `get_role_of(address)` | Partial: admin/issuer discovery is not wired |
| Event decoder uses the SDK topic registry | Contract publishes the canonical topics in `docs/events.md` | Partial: safe unknown fallback exists, but topic parity is incomplete |
| SDK has no deployment compatibility probe | Contract exposes `get_capabilities`, `supports_capability`, and `check_interface_compatibility` | Gap: feature gating is not yet wired into the SDK |

Do not paper over a `Drift`, `Partial`, or `Gap` row in a dashboard adapter.
Either keep the affected flow mocked/disabled or land and test the SDK change
that closes the row.

## Dashboard integration target

[`Axionvera/aegis-dashboard`](https://github.com/Axionvera/aegis-dashboard)
is the known dashboard integration target. Its current package manifest does
not depend on `@aegis/sdk`; the integration is intentionally adapter-based and
still uses SDK-shaped stubs in several paths:

| Dashboard area | Integration path | SDK surface it expects |
| --- | --- | --- |
| Provider boundary | `src/lib/sdk/LiveAegisProvider.ts`, `src/lib/aegis/client.ts`, `src/hooks/useAegis.ts` | client construction, compliance reads, asset writes, and portfolio reads |
| Investor views | portfolio and onboarding flows under `src/lib/aegis/` and dashboard documentation | `InvestorModule`, `ComplianceModule`, portfolio types |
| Auth and route access | `src/features/auth/resolveRole.ts`, auth store, route guard | `RoleModule` and capability checks |
| Transaction/activity UI | transaction store/components and provider adapter | `AssetModule` hashes/results and decoded events |
| Diagnostics/recovery | diagnostics and SDK recovery features | configuration and network diagnostic helpers |

The dashboard repository documents that the real package is not fully wired
yet. Keep the adapter boundary until the relevant matrix rows are `Aligned`
and the real-package integration has contract-backed tests.

## Breaking-change rules

Treat each of the following as a breaking public API change:

- removing or renaming an exported symbol, package entry point, client module,
  method, option, return field, error code, or event kind;
- making an optional parameter or field required, narrowing an accepted input,
  or changing a method from a safe fallback to a thrown error (or vice versa);
- changing the meaning of a boolean/status, transaction hash, diagnostic,
  capability, or receipt without changing its type;
- changing the contract entrypoint, argument order/type, event topic, or payload
  field expected by a public SDK method;
- moving a testing export into the production entry point, or exposing an
  internal `src/` path as a supported import.

For a breaking change:

1. Update this matrix, the API reference, affected focused docs, and the
   dashboard adapter notes in the same PR.
2. Add or update contract/SDK compatibility fixtures and consumer-facing
   tests. A mock-only test is not sufficient for a contract-bound change.
3. Add a deprecation path when practical; do not silently repurpose an
   existing symbol, field, error code, or event topic.
4. While the package is `0.x`, release the break in the next minor version and
   publish explicit migration notes. After `1.0.0`, use a major version.
5. Re-check the known dashboard integration target and the companion contract before
   release. A green SDK unit suite alone does not prove cross-repository
   compatibility.

Additive exports, optional fields, new typed error variants, and new event
kinds can be non-breaking only when existing consumers continue to compile
and existing runtime meanings are unchanged. Event and enum consumers must
retain an unknown fallback for forward compatibility.

## Reviewer checklist

- Compare `src/index.ts`, `src/testing/index.ts`, and `package.json#exports`
  with the package-entry and module tables.
- Compare every contract-bound method with the companion contract's current
  `docs/contract-spec.md` and `docs/events.md`.
- Search the known dashboard integration target for `@aegis/sdk`, `useAegis`, and the
  affected method/type names.
- Update row status and snapshot revision whenever a compatibility gap closes
  or a public export changes.
- Link migration notes for every breaking row change.
