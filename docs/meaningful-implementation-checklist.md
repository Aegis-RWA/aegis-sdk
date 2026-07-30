# Aegis SDK Meaningful Implementation Checklist

> **Last updated:** 2026-07-28
>
> This document defines what constitutes "meaningful work" for Aegis SDK contributions.
> Small or minimal changes that do not meet these criteria may not qualify for
> GrantFox evaluation.

---

## 1. Purpose

Not all PRs are equal. A "meaningful" implementation is one that:

- Solves a real problem described in the issue
- Adds measurable value to the codebase (logic, tests, or documentation)
- Follows the SDK's existing patterns and quality standards
- Is complete enough to be reviewed and merged without substantial follow-up work

This checklist helps contributors self-evaluate whether their PR meets the bar
for meaningful work before submitting.

---

## 2. Mandatory Criteria

Every PR **must** satisfy all of the following:

### 2.1 Issue Alignment

- [ ] The PR addresses every acceptance criterion in the linked issue
- [ ] The scope matches the issue — no scope creep, no partial solutions
- [ ] If the issue has multiple subtasks, each one is addressed or explicitly excluded
  with a reason

### 2.2 Code Quality

- [ ] TypeScript types are strict (no `any`, no `as` casts without justification)
- [ ] Functions have clear return types (not inferred `Promise<any>`)
- [ ] Error handling is complete — every error path is typed and tested
- [ ] Code follows existing SDK patterns (src/ structure, naming conventions, export style)
- [ ] No dead code, commented-out code, or console.log debugging artifacts
- [ ] Lint passes: `npm run lint`

### 2.3 Test Coverage

- [ ] At least one meaningful test is added or updated
- [ ] Tests cover both success and failure/edge-case paths
- [ ] Tests run: `npm run check` passes
- [ ] Test descriptions describe the scenario, not just "should work"

### 2.4 Documentation

- [ ] If the PR adds or changes a public API, docs/ is updated
- [ ] If the PR fixes a bug, the fix is documented in the PR description
- [ ] If the PR introduces a new concept, the README or relevant docs file is updated

---

## 3. What Is NOT Meaningful

The following changes alone are **not** considered meaningful:

| Type | Example | Why Not Meaningful |
|------|---------|-------------------|
| Typo fix | Fixing a spelling error in a comment | No functional or structural value |
| Whitespace cleanup | Reformating a file without logic changes | No behavioral change |
| Dependency bump | Updating a package.json version with no code change | No SDK value added |
| Re-export shuffle | Moving exports without new functionality | Existing code works identically |
| Config change | Changing tsconfig or eslint config without a code reason | Should be part of a code PR |
| Single-line no-op | Adding an empty catch block or unused variable | No behavioral change |
| Comment-only | Adding explanatory comments | Better in code structure or docs |

A PR containing **only** these changes will not pass GrantFox evaluation.

---

## 4. Meaningful Work Examples

### ✅ Meaningful

| Change | Why |
|--------|-----|
| Adding a new SDK function with tests | New capability, verifiable |
| Fixing a bug with a regression test | Bug fixed, future-proofed |
| Adding error handling with typed error classes | Improved reliability |
| Writing comprehensive docs for a module | Better developer experience |
| Refactoring with improved types and tests | Code quality improvement |

### ❌ Not Meaningful

| Change | Why |
|--------|-----|
| Renaming a variable across files | No behavioral change |
| Removing an unused import | Good hygiene but not meaningful alone |
| Adding a single assertion to an existing test | Bare minimum, not thorough |
| Copying existing pattern without adapting | No original contribution |

---

## 5. Self-Evaluation

Before opening a PR, ask yourself:

1. **Does this change fix a real problem?** — If the issue is closed without this change,
   would the problem remain?
2. **Does this change add testable value?** — Can someone verify the change works by
   running tests?
3. **Would I be proud to ship this?** — If it feels like the bare minimum, it probably is.
4. **Is the scope appropriate?** — Does it match the issue, or did I over-engineer it?
5. **Is documentation complete?** — Could someone use this change without asking questions?

If the answer to any of these is "no," the PR is not ready.

---

## 6. What Happens After Submission

1. Maintainer reviews the PR against this checklist
2. If criteria are met, PR is merged
3. After merge, GrantFox evaluates against the same criteria
4. If evaluation passes, payment is processed through GrantFox
5. If evaluation fails, feedback is provided — address in a new PR

PRs that do not meet the meaningful-work bar will still be reviewed and may be merged
if they are technically correct, but they will **not** qualify for GrantFox evaluation.
