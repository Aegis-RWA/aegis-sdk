# CI Failure Resolution Workflow

This guide explains how to reproduce, diagnose, and resolve GitHub Actions CI failures locally before requesting maintainer review for the Aegis SDK.

---

## Overview & Maintainer Expectations

Aegis SDK uses GitHub Actions (`.github/workflows/runtime-compatibility.yml`) to verify type safety, unit test pass rates, and Node.js version compatibility (Node 20 and Node 22).

### Maintainer Expectations
A passing CI run is required for code review and PR approval. Maintainers will not review or merge pull requests with failing CI status. PRs with unresolved CI failures may be delayed or closed if there is no active communication from the author.

---

## Why CI Verification Matters

1. **SDK Stability:** Aegis SDK acts as middleware for the Aegis RWA Protocol. Test failures or type errors can break downstream integration.
2. **Node.js Matrix Support:** Automated checks verify runtime compatibility across Node 20 and Node 22.
3. **Review Efficiency:** Clean CI passes ensure PRs are ready for functional review.

---

## Local Commands

Run these commands locally to reproduce and verify CI checks before pushing:

| Target | Command | Description |
| :--- | :--- | :--- |
| **Full Release Gate** | `npm run check` | Runs build, unit tests in band, and compatibility checks. |
| **TypeScript Build** | `npm run build` | Compiles TypeScript (`tsc`) and checks for type errors. |
| **Unit Tests** | `npm test` | Runs Jest unit tests under `tests/`. |
| **Runtime Compatibility** | `npm run test:compat` | Executes `scripts/check-compat.mjs` export probes. |
| **Linting** | `npm run lint` | Runs ESLint on `src/**/*.ts`. |
| **Code Formatting** | `npm run format` | Runs Prettier write on TypeScript files. |

---

## Common Failure Modes & Resolution

### 1. TypeScript Compilation Errors (`npm run build`)
* **Symptom:** Build step fails with `TS2304`, `TS2345`, or signature mismatch errors.
* **Resolution:** Run `npm run build` locally, resolve missing imports or type mismatches, and confirm exported types match `docs/api-reference.md`.

### 2. Unit Test Failures (`npm test`)
* **Symptom:** Jest suite fails on assertions under `tests/`.
* **Resolution:** Run `npm test -- --runInBand` locally. For Soroban/Stellar contract calls, use the mock client from `@aegis/sdk/testing` as described in `docs/testing.md`.

### 3. Compatibility Probe Failures (`npm run test:compat`)
* **Symptom:** The `Run release compatibility gate` step fails on `scripts/check-compat.mjs`.
* **Resolution:** Run `npm run build && npm run test:compat`. Verify that `package.json` entry points (`main`, `types`, `exports`) match generated artifacts in `dist/`.

### 4. Linting & Style Issues (`npm run lint`)
* **Symptom:** ESLint reports syntax or unformatted code violations.
* **Resolution:** Run `npm run lint` to inspect issues and `npm run format` to apply formatting rules.

### 5. Dependency Installation Differences
* **Symptom:** CI fails during dependency setup or script execution.
* **Resolution:** Install dependencies using the same flags CI uses:
  ```bash
  npm install --ignore-scripts --no-audit --no-fund
  ```

---

## Step-by-Step Resolution Procedure

When a pull request check fails:

1. **Check Log Output:** Click Details on the failed GitHub Actions job and view the step output log.
2. **Reproduce Locally:** Checkout your branch locally and run `npm run check`.
3. **Fix and Re-test:** Apply necessary code or type fixes and re-run `npm run check` until it passes.
4. **Push Updates:** Commit your changes and push to your feature branch to trigger a new CI run.
5. **Verify Job Status:** Confirm all matrix jobs on GitHub show a passing status before requesting review.

---

## Contributor Checklist

Before requesting review:

- [ ] `npm run build` passes cleanly.
- [ ] `npm test` passes all unit tests.
- [ ] `npm run test:compat` passes compatibility checks.
- [ ] `npm run check` completes without errors locally.
- [ ] All GitHub Actions matrix checks pass on the pull request.
