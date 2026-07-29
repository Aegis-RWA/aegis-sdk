# Aegis SDK Testing Evidence PR Requirement

> **Last updated:** 2026-07-28
>
> Every PR to the Aegis SDK must include **clear testing evidence** — not just passing CI,
> but proof that the change was tested meaningfully.

---

## 1. Why Testing Evidence Matters

Testing evidence serves three purposes:

1. **Reviewer confidence** — A reviewer can verify that the change was actually exercised,
   not just type-checked.
2. **Audit trail** — GrantFox evaluators need to see that the PR was tested, not just merged.
3. **Regression prevention** — Evidence of testing means the next contributor can reproduce
   the test scenario.

Without testing evidence, a PR may be merged by maintainers but **fail GrantFox evaluation**.

---

## 2. Required Evidence Per PR Type

### 2.1 Feature / Logic Change (most PRs)

| Requirement | What to Include |
|-------------|-----------------|
| Tests added | At least one new test file or test case in `tests/` |
| Test output | Paste the test run output in the PR description |
| CI status | Link to the CI check run for the PR commit |
| Manual verification | If applicable, describe what was verified manually |

Example PR description section:

```
## Testing Evidence

- Added tests/token-transfer.test.ts (3 test cases)
- Test output: "PASS  tests/token-transfer.test.ts (5 tests)"
- CI: https://github.com/Axionvera/aegis-sdk/actions/runs/...
- Verified manually: ran npm run check locally
```

### 2.2 Documentation Change

| Requirement | What to Include |
|-------------|-----------------|
| Doc review | Verify links are valid and code examples parse |
| No new tests needed | State explicitly: "No tests added — docs-only change" |
| Link check | Note that internal links in docs are verified |

### 2.3 Bug Fix

| Requirement | What to Include |
|-------------|-----------------|
| Regression test | Add a test that reproduces the bug BEFORE the fix |
| Test passes both ways | Show that the test fails on old code, passes on new code |
| Root cause | One-line explanation of what caused the bug |

### 2.4 Refactor (no behavior change)

| Requirement | What to Include |
|-------------|-----------------|
| Existing tests still pass | Run and paste output of `npm run check` |
| No new tests needed | State why existing coverage is sufficient |

---

## 3. How to Present Evidence in PR Description

Use this template in the PR body:

```markdown
## Testing Evidence

### Tests Added
- `tests/feature-x.test.ts` — 4 new test cases covering:
  - ✅ Happy path: valid input → expected output
  - ✅ Edge case: empty/null input → graceful error
  - ✅ Error path: invalid input → typed error
  - ✅ Integration: feature-x + feature-y interaction

### Test Output
```
PASS  tests/feature-x.test.ts (4 tests)
  ✓ handles valid input (2ms)
  ✓ rejects empty input (1ms)
  ✓ returns typed error for invalid input (3ms)
  ✓ integrates with feature-y (5ms)

Test Suites: 1 passed, 1 total
Tests:       4 passed, 4 total
```

### CI Status
- ✅ TypeScript compilation: `tsc --noEmit` passes
- ✅ Lint: `npm run lint` passes
- ✅ Runtime check: `npm run check` passes

### Manual Verification
- Ran feature-x with sample config — output matches expected format
- Tested edge case with null input — error message is descriptive
```

---

## 4. What Happens Without Evidence

| Scenario | Consequence |
|----------|-------------|
| No tests, no test output | PR may be merged but fails GrantFox evaluation |
| CI-only (no test output pasted) | Reviewer must run tests manually — slows review |
| Vague evidence ("tests pass") | Not considered evidence — evaluation fails |
| Only happy-path tests | Evaluator may request edge-case tests |
| No evidence at all | PR may be closed as incomplete |

**Bottom line:** If you don't include testing evidence, you are gambling that the
evaluator will accept the PR without it. In practice, they won't.

---

## 5. Updating the PR Template

The PR template at `.github/PULL_REQUEST_TEMPLATE.md` (or `.github/pull_request_template.md`)
already includes a testing section. When creating a new template or updating an existing one,
include this section:

```markdown
### Testing Evidence

- [ ] Tests added/updated in `tests/`
- [ ] Test output pasted below
- [ ] CI status linked
- [ ] Manual verification described (if applicable)

**Test output:**
```

If the template already exists, ensure the testing section is at the top of the PR body,
not hidden after detailed implementation notes.
