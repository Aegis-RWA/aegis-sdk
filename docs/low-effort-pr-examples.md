# Low-Effort PR Examples & High-Quality Standards

This document outlines examples of low-effort, under-tested, partial, or failing-CI Pull Requests that fail evaluation standards for the **Aegis SDK** repository (`@axionvera/aegis-sdk`), along with the expected high-quality alternatives for contributors.

---

## Overview of Evaluation Criteria

Even if a PR passes automated CI checks or gets merged, contributions that do not meet core quality and reliability standards may fail review evaluation. High-quality PRs for Aegis SDK are expected to be complete, robustly tested, fully documented, and compliant with protocol standards.

---

## Common Low-Effort PR Anti-Patterns & Alternatives

### 1. Superficial Changes & Cosmetic Edits

* **Anti-Pattern:** Submitting tiny edits such as fixing a typo in a docstring, tweaking whitespace, or reordering imports without addressing underlying code quality, issues, or functionality.
* **Why it fails evaluation:** Does not add meaningful value to the codebase or developer experience.
* **Better Alternative:** Combine documentation fixes with meaningful content improvements, complete code examples, or bug fixes. Ensure the PR solves a real developer problem or addresses an open issue.

---

### 2. Under-Tested or Untested Implementations

* **Anti-Pattern:** Adding a new public SDK method or feature without writing corresponding unit tests in `tests/`, or writing tests that only check trivial true/false assertions without exercising error paths.
* **Why it fails evaluation:** Lacks test coverage and risks breaking production applications or failing silently on edge cases.
* **Better Alternative:** 
  - Write comprehensive unit tests in `tests/` for all happy paths and error/edge conditions.
  - Use the mock client from `@aegis/sdk/testing` (see [`docs/testing.md`](testing.md)) to simulate SDK responses and network failures deterministically.

```typescript
// BAD: Superficial test with no error path assertions
test('checkWhitelist works', async () => {
  const result = await aegis.compliance.checkWhitelist('G_USER');
  expect(result).toBeDefined();
});

// GOOD: Thorough test covering success, fallbacks, and error handling
test('checkWhitelist returns whitelist status and handles invalid address', async () => {
  mockClient.setComplianceStatus('G_USER', true);
  const isApproved = await aegis.compliance.checkWhitelist('G_USER');
  expect(isApproved).toBe(true);

  // Assert error handling path
  await expect(aegis.compliance.checkWhitelist('INVALID_KEY'))
    .rejects.toThrow('Invalid public key');
});
```

---

### 3. Partial or Incomplete Implementations

* **Anti-Pattern:** Submitting a PR that only implements half of a requested feature, leaves `// TODO` comments in production logic, or stubs out functions with fallback return values (e.g. returning `null` or `{}`) instead of handling errors properly.
* **Why it fails evaluation:** Introduces dead code or incomplete behavior that degrades SDK reliability.
* **Better Alternative:** Deliver complete, end-to-end features. If a feature needs to be split across PRs, coordinate with maintainers first and ensure each PR provides self-contained, working functionality.

```typescript
// BAD: Incomplete method with placeholder return
async discoverRole(address: string): Promise<RoleResult> {
  // TODO: implement contract query
  return { role: 'unknown', confidence: 'low' };
}

// GOOD: Complete implementation handling contract responses and errors
async discoverRole(address: string): Promise<RoleResult> {
  this.validateAddress(address);
  try {
    const roleData = await this.rpc.getRole(address);
    return this.parseRoleData(roleData);
  } catch (error) {
    throw new RoleDiscoveryError(`Failed to discover role for ${address}`, { cause: error });
  }
}
```

---

### 4. Ignoring CI & Build Failures

* **Anti-Pattern:** Opening or leaving a PR with failing CI checks (linting errors, broken TypeScript compilation, or failing Jest test suites).
* **Why it fails evaluation:** Breaks repository build gates and signals lack of local verification before submission.
* **Better Alternative:** Always run the complete local check suite before opening a PR:
  ```bash
  npm run check
  ```
  Ensure TypeScript compiles clean (`npm run build`), unit tests pass (`npm test`), and browser/Node runtime compatibility checks succeed (`npm run test:compat`).

```typescript
// BAD: Type error that breaks compilation — PR opened without running npm run build
async getPortfolioValue(address: string) {
  const holdings = await this.investor.getPortfolio(address);
  // TypeScript error: 'totalValue' does not exist on type 'PortfolioHolding[]'
  return holdings.totalValue;
}

// BAD: Test referencing a method that doesn't exist — causes Jest to fail in CI
test('getPortfolioValue returns a number', async () => {
  // TypeError at runtime: aegis.investor.getPortfolioValue is not a function
  const value = await aegis.investor.getPortfolioValue('G_USER');
  expect(value).toBeGreaterThan(0);
});

// GOOD: Compiles cleanly and tests pass — verified locally with npm run check
async getPortfolioValue(address: string): Promise<number> {
  const holdings = await this.investor.getPortfolio(address);
  return holdings.reduce((sum, h) => sum + h.value, 0);
}

test('getPortfolioValue sums holding values', async () => {
  mockClient.setPortfolio('G_USER', [
    { assetCode: 'USDC', value: 500 },
    { assetCode: 'USDT', value: 300 },
  ]);
  const value = await aegis.investor.getPortfolioValue('G_USER');
  expect(value).toBe(800);
});
```

---

### 5. Incomplete Documentation & Missing API Updates

* **Anti-Pattern:** Modifying SDK function signatures, parameters, or return types without updating [`docs/api-reference.md`](api-reference.md) or [`README.md`](../README.md).
* **Why it fails evaluation:** Creates a mismatch between published code and documentation, causing confusion for SDK consumers.
* **Better Alternative:** Follow the update checklist in [`CONTRIBUTING.md`](../CONTRIBUTING.md#updating-api-reference-documentation):
  - Document all parameters, return types, fallback values, and thrown error classes.
  - Update usage examples using sanitised placeholder keys (`G...`, `C...`, `S...`).

```typescript
// BAD: New method added with no docs/api-reference.md entry and no JSDoc
async getRedemptionStatus(address: string) {
  return this.rpc.query('redemption_status', address);
}

// GOOD: Method includes JSDoc and docs/api-reference.md is updated alongside it
/**
 * Returns the current redemption status for the given investor address.
 *
 * @param address - The investor's Stellar public key (`G...`).
 * @returns `'pending' | 'approved' | 'rejected'` — the redemption state,
 *          or `null` if no redemption request is on record.
 * @throws {PortfolioError} If the address is invalid or the RPC call fails.
 */
async getRedemptionStatus(address: string): Promise<'pending' | 'approved' | 'rejected' | null> {
  this.validateAddress(address);
  try {
    return await this.rpc.query('redemption_status', address);
  } catch (error) {
    throw new PortfolioError(`Failed to fetch redemption status for ${address}`, { cause: error });
  }
}
```

---

## 6. Acceptable Contribution Example

The following shows what a contribution that meets evaluation standards looks like across all five dimensions.

**Scenario:** Add a `getRedemptionStatus` method to `InvestorModule`.

```typescript
// src/investor/portfolio.ts — complete, typed implementation with error handling
async getRedemptionStatus(
  address: string
): Promise<'pending' | 'approved' | 'rejected' | null> {
  this.validateAddress(address);
  try {
    return await this.rpc.query('redemption_status', address);
  } catch (error) {
    throw new PortfolioError(
      `Failed to fetch redemption status for ${address}`,
      { cause: error }
    );
  }
}
```

```typescript
// tests/investor.test.ts — covers happy path, null case, and error path
describe('getRedemptionStatus', () => {
  test('returns status when a redemption request exists', async () => {
    mockClient.setRedemptionStatus('G_USER', 'pending');
    const status = await aegis.investor.getRedemptionStatus('G_USER');
    expect(status).toBe('pending');
  });

  test('returns null when no redemption request exists', async () => {
    mockClient.setRedemptionStatus('G_USER', null);
    const status = await aegis.investor.getRedemptionStatus('G_USER');
    expect(status).toBeNull();
  });

  test('throws PortfolioError on RPC failure', async () => {
    mockClient.simulateError('redemption_status', new Error('timeout'));
    await expect(aegis.investor.getRedemptionStatus('G_USER'))
      .rejects.toThrow(PortfolioError);
  });
});
```

**CI verification** (`npm run check` output pasted in the PR):
```
> npm run build    ✓  0 errors
> npm test         ✓  all 42 tests passed
> npm run test:compat  ✓  Node 20, Node 22 — pass
```

**Documentation** — `docs/api-reference.md` updated with full signature, parameter table, return values (including `null`), and thrown error class.

A contribution structured this way fully satisfies the GrantFox evaluation criteria.

---

## Summary Checklist for High-Quality PRs

Before submitting your PR, ensure it meets the following standards:

- [ ] Resolves a clear issue or adds tangible value.
- [ ] Includes full unit test coverage under `tests/` using `@aegis/sdk/testing`.
- [ ] Provides a complete implementation with no unresolved `// TODO` stubs in core logic.
- [ ] Passes `npm run check` locally (build, tests, and compat probes).
- [ ] Updates related documentation (`docs/api-reference.md`, `README.md`).
- [ ] References the relevant issue (e.g., `Closes #90`).
