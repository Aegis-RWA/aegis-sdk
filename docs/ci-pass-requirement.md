# CI Pass Requirement

> **Applies to:** Aegis SDK (`@aegis/sdk`)
> **Last updated:** 2026-07-29

---

## Overview

All pull requests submitted to the Aegis SDK must pass continuous integration
(CI) checks before they are reviewed or merged. A green CI run is **not
optional** — it is the minimum bar for a contribution to be considered complete.

Failing CI checks block both review and merge. The requirement applies to all
contributors, including first-time contributors and those working on
documentation-only changes.

---

## Why CI Pass Status Matters

### Evaluation Impact

CI status is a primary factor in [GrantFox](https://grantfox.io) compensation
evaluations. A merged PR with unresolved or skipped CI failures will receive
reduced evaluation credit, even if the code changes were accepted. See the
[Contributor Evaluation Policy](./contributor-evaluation-policy.md#33-ci-pipeline-compliance)
for full details.

### Code Quality Gate

The CI pipeline enforces type safety, unit test pass rates, code style
consistency, and runtime compatibility across supported Node.js versions.
Skipping these checks introduces silent regressions that can break downstream
consumers of the SDK.

### Cross-Environment Verification

What works on a contributor's machine may fail on a different Node.js version
or operating system. CI matrix builds (Node 20 and Node 22) catch
environment-specific issues that local testing alone cannot.

---

## CI Checks

The Aegis SDK CI pipeline (`.github/workflows/runtime-compatibility.yml`) runs
the following checks on every pull request:

| Check | Gate | What It Verifies |
| :--- | :--- | :--- |
| **TypeScript Build** | `npm run build` | Compilation succeeds with zero type errors. |
| **Unit Tests** | `npm test` | All Jest test suites pass under `tests/`. |
| **Runtime Compatibility** | `npm run test:compat` | Export probes and runtime checks pass on Node 20 and Node 22. |
| **Linting** | `npm run lint` | ESLint rules are satisfied with no violations. |
| **Code Formatting** | `npm run format` | Prettier formatting rules are applied consistently. |

---

## Common Failure Types

When CI fails, the failure usually falls into one of the categories below.
Each is linked to its resolution guide.

| Failure Type | Symptom | Resolution Guide |
| :--- | :--- | :--- |
| **TypeScript errors** | Build step fails with type mismatch or missing import errors. | [CI Response Guide — Type errors](./ci-response-guide.md#type-errors) |
| **Test failures** | Jest suite fails on one or more assertions. | [CI Response Guide — Test failures](./ci-response-guide.md#test-failures) |
| **Compatibility probe failures** | `test:compat` step fails on export or runtime probes. | [CI Response Guide — Runtime compat failures](./ci-response-guide.md#runtime-compat-failures) |
| **Lint violations** | ESLint reports code style or syntax issues. | [CI Response Guide — Lint failures](./ci-response-guide.md#lint-failures) |
| **Format violations** | Prettier detects unformatted files. | [CI Response Guide — Format failures](./ci-response-guide.md#format-failures) |
| **Dependency issues** | `npm ci` fails during install or script execution. | [CI Response Guide — Dependency issues](./ci-response-guide.md#dependency-issues) |

---

## Verifying CI Locally

Reproduce the full CI gate on your machine before pushing. A passing local run
strongly correlates with a passing CI run.

| Command | What It Checks |
| :--- | :--- |
| `npm run check` | Build + unit tests + runtime compatibility (full release gate). |
| `npm run verify` | Lint + format + build + test + compat (all-in-one pre-submit). |
| `npm run build` | TypeScript compilation only. |
| `npm test` | Unit test suite only. |
| `npm run lint` | ESLint rules only. |

For step-by-step instructions on reproducing and fixing specific failures, see
the [CI Resolution Workflow](./ci-resolution-workflow.md).

---

## Contributor Expectations

### Before Opening a PR

- Run `npm run verify` locally and confirm all steps pass.
- Do not push code that you have not verified locally.
- If a check fails locally, fix it **before** opening the pull request.

### When CI Fails

- Investigate the failure immediately. Click **Details** on the failed GitHub
  Actions job to view the output log.
- Fix the root cause — do not skip checks, disable rules, or add `@ts-ignore`
  comments to silence failures.
- Push a fix to your branch within a reasonable timeframe. PRs with stale CI
  failures may be closed if there is no active communication.

### What Happens If CI Stays Red

| CI Status | Outcome |
| :--- | :--- |
| **Green (all checks pass)** | PR is eligible for review and merge. |
| **Red (one or more failures)** | PR will not be reviewed. Maintainers will wait for a green run. |
| **Red with no update** | PR may be closed after a period of inactivity. |

### If You Are Stuck

Some failures are harder to diagnose than others, especially environment-specific
issues. If you cannot resolve a CI failure:

1. Re-read the failure log carefully — the error message is often enough to
   identify the problem.
2. Run the failing command locally with the same Node.js version CI uses
   (Node 20 or Node 22).
3. Check [existing issues](https://github.com/AegisRWA/aegis-sdk/issues) for
   similar failures and solutions.
4. Open a comment on your PR explaining what you tried and what you observed.
   Include a link to the failing CI run.

---

## Related Documentation

- [CI Resolution Workflow](./ci-resolution-workflow.md) — step-by-step procedure
  for reproducing and fixing CI failures locally.
- [CI Response Guide](./ci-response-guide.md) — quick reference for diagnosing
  and fixing each failure type.
- [PR Evidence Checklist](./pr-evidence-checklist.md) — required evidence for
  all pull requests, including CI status verification.
- [Contributor Evaluation Policy](./contributor-evaluation-policy.md) — how CI
  status affects GrantFox compensation evaluation.
- [Verification Command](./verification.md) — local `npm run verify` usage and
  troubleshooting.
