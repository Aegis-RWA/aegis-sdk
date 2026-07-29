# Test-First Contribution Guide

Aegis SDK changes should start with the behavior they need to prove. Before opening a PR, identify the public SDK contract being changed, add or update the focused test that describes that contract, and then make the implementation satisfy it.

## When Tests Are Required

Add or update tests for any change that affects one of these SDK surfaces:

- Compliance checks: whitelist, accreditation, transfer-eligibility, and any denial reason returned to callers.
- RWA metadata: asset identifiers, metadata normalization, document references, and missing-field fallbacks.
- Admin actions: role-gated mutations, signed transaction builders, receipt decoding, and failure propagation.
- Investor reads: portfolio balances, claimable amounts, subscription status, and not-found behavior.
- Transaction receipts: Soroban event decoding, status mapping, transaction hash handling, and retry-safe polling.
- Typed SDK errors: error codes, messages, cause preservation, and conversion from RPC or contract failures.

Small documentation-only edits may skip tests, but the PR must say why no executable behavior changed.

## Recommended Flow

1. Write the failing test first, or update an existing test so it captures the new acceptance criteria.
2. Cover the happy path and at least one explicit negative path.
3. Implement the smallest SDK change that makes the test meaningful and passing.
4. Run the narrow test locally, then run the full verification command before review.
5. Paste the exact commands and results in the PR evidence checklist.

## Test Expectations by Area

| Area | Happy path | Negative path |
| --- | --- | --- |
| Compliance checks | Approved address returns the expected typed result. | Unknown, blocked, or malformed address returns a stable denial result or typed error. |
| RWA metadata | Complete metadata maps to the documented SDK shape. | Missing optional data uses documented defaults; invalid required data is rejected. |
| Admin actions | Authorized admin call builds the expected transaction or receipt model. | Unauthorized role, bad arguments, or failed simulation surfaces a typed SDK error. |
| Investor reads | Existing investor state is returned with normalized amounts and identifiers. | Missing investor, empty position set, or stale RPC response is handled explicitly. |
| Transaction receipts | Known event topics decode into typed receipt variants. | Unknown topics, failed transactions, or malformed event values preserve safe fallback data. |
| Typed SDK errors | Known failures map to the exported error type and code. | Unknown nested errors keep their cause and do not lose diagnostic context. |

## No-Test Justification Rules

A PR may omit tests only when all of the following are true:

- The change is documentation, comments, examples, package metadata, or wording only.
- No exported TypeScript type, SDK method, runtime branch, script, or test fixture changes.
- The PR explains why behavior is unchanged and lists the files reviewed.

Do not use a no-test justification for bug fixes, refactors that move logic, validation changes, error handling, or compatibility work.

## Local Commands

Use the narrowest command first while developing:

```bash
npm test -- --runInBand tests/<focused-test-file>.test.ts
```

Before requesting review, run the release gate:

```bash
npm run verify
```

If `npm run verify` fails, fix the failing check or document why the failure is unrelated to the PR with a link to the failing log.

## PR Evidence

In the PR description, include:

- The issue number and acceptance criteria covered.
- The new or updated test files.
- The happy-path and negative-path cases covered.
- The exact command output for the focused test and `npm run verify`, or a clear no-test justification.