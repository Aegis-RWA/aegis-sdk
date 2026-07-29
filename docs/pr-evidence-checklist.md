# Pull Request Evidence Checklist

## Status

**Applies to:** Aegis SDK (`@aegis/sdk`)
**Last updated:** 2026-07-28

---

## Purpose

Every pull request submitted to the Aegis SDK must include clear, verifiable
evidence that the work is complete and correct. This document defines each
checklist item, explains **why** it exists, and describes what constitutes
acceptable evidence.

Reviewers use this checklist to evaluate PRs objectively. Contributors who
follow it reduce review cycles and speed up merges.

---

## 1. Issue Reference

| Requirement | The PR must link to the GitHub issue it addresses. |
|---|---|
| **Why** | Without an issue reference, reviewers cannot verify scope, priority, or acceptance criteria. |
| **How to satisfy** | Use a [closing keyword](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/linking-a-pull-request-to-an-issue) in the PR description — e.g. `Closes #42` or `Fixes #42`. If the PR partially addresses an issue, use `Relates to #42` and explain what remains. |
| **Acceptable evidence** | A `Closes #N` or `Relates to #N` line in the PR description that links to a valid, open issue. |

---

## 2. Implementation Summary

| Requirement | The PR must describe what changed, why, and which files are affected. |
|---|---|
| **Why** | Reviewers need context before reading diffs. A summary lets them verify that the approach matches the agreed design. |
| **How to satisfy** | Write 2–5 sentences in the PR description covering: (1) what the change does, (2) why this approach was chosen over alternatives, (3) which files or modules were added, modified, or removed. |
| **Acceptable evidence** | A prose summary in the PR description. For large changes, a bullet list of affected files grouped by purpose is preferred. |

### Guidelines

- **Features:** Explain the user-facing behaviour and any new exports.
- **Bug fixes:** Describe the root cause, the fix, and how you confirmed the
  bug no longer reproduces.
- **Refactors:** State what was restructured and why (performance, readability,
  upcoming feature preparation).
- **Documentation:** List the documents added or updated and summarise the
  content change.

---

## 3. Tests

| Requirement | New or updated tests must accompany every code change. |
|---|---|
| **Why** | The Aegis SDK is critical middleware. Untested changes risk silent regressions across consumer applications. |
| **How to satisfy** | Add or update unit tests in `tests/` for every new or modified public method. Use the mock client (`@aegis/sdk/testing`) for predictable responses (see [`docs/testing.md`](./testing.md)). |
| **Acceptable evidence** | New test files or expanded test cases visible in the diff, plus passing test output in the "Commands Run" section. |

### When tests are not applicable

Some changes do not require tests:

- **Documentation-only** changes (Markdown files, comments).
- **CI/CD configuration** changes (workflow YAML, GitHub templates).
- **Non-functional metadata** changes (`package.json` keywords, `.gitignore`).

If you skip tests, state the justification in the PR template's collapsible
section. Reviewers will evaluate whether the justification is valid.

---

## 4. Commands Run

| Requirement | The PR must include the terminal output of all verification commands. |
|---|---|
| **Why** | Pasted output proves the contributor ran the checks locally before requesting review. It catches issues that CI might miss (environment-specific failures) and reduces wasted CI minutes. |
| **How to satisfy** | Run the commands below and paste the output into the PR template's collapsible section. |

### Required commands

```bash
# 1. Build — verifies TypeScript compilation succeeds
npm run build

# 2. Lint — enforces code style
npm run lint

# 3. Tests — runs the full unit test suite
npm test

# 4. Full release gate — build + tests + browser/Node compatibility
npm run check
```

### What reviewers look for

- **Zero errors** in build and lint output.
- **All tests passing** with no skipped tests (unless justified).
- **No unrelated warnings** introduced by the change.

If a command produces warnings that pre-date your change, note that in the
reviewer notes section so reviewers do not attribute them to your PR.

---

## 5. CI Status

| Requirement | All GitHub Actions checks must pass before the PR is merged. |
|---|---|
| **Why** | CI is the single source of truth for cross-environment compatibility. A green build confirms the change works on Node 20 and Node 22 (see [`.github/workflows/runtime-compatibility.yml`](../.github/workflows/runtime-compatibility.yml)). |
| **How to satisfy** | Push your branch, wait for CI to complete, and confirm all checks are green. If a check fails, investigate and fix the root cause. |
| **Acceptable evidence** | Green status badges on the PR. If a failure is unrelated to the change (e.g. a flaky upstream dependency), explain the root cause in the CI failure notes section. |

---

## 6. Acceptance Criteria Coverage

| Requirement | Every acceptance criterion from the linked issue must be addressed. |
|---|---|
| **Why** | PRs that miss acceptance criteria create incomplete issues that are hard to track and re-open. |
| **How to satisfy** | Copy each acceptance criterion from the issue into the audit table in the PR template's Section 6. For every row, provide implementation, test, and documentation evidence and select an allowed status. See the [Acceptance Criteria Audit](acceptance-criteria-audit.md). |
| **Acceptable evidence** | A completed audit table in the PR where every criterion maps to concrete evidence and a clear status. |

### Partial completion

If a PR intentionally addresses only some criteria, use the audit
template's **Partial** or **Deferred** statuses. It must also:

1. Use `Relates to #N` instead of `Closes #N`.
2. List all criteria and mark incomplete rows as **Partial** or **Not started**.
3. Explain the remaining work and link to any follow-up issues.

---

## Quick Reference

| # | Checklist Item | Key Evidence |
|---|---|---|
| 1 | Issue reference | `Closes #N` in PR description |
| 2 | Implementation summary | What, why, and which files |
| 3 | Tests | New/updated tests or justification |
| 4 | Commands run | Pasted terminal output |
| 5 | CI status | Green GitHub Actions checks |
| 6 | Acceptance criteria | Audit table with evidence and status for every criterion |

---

## Enforcement

- **Reviewers** should verify all six sections before approving.
- **Maintainers** should not merge PRs with unchecked required items.
- PRs that do not follow this checklist may be returned with a request to
  complete the missing sections before re-review.

---

## Related Documentation

- [Contributing Guide](../CONTRIBUTING.md) — development workflow, branching,
  and code style.
- [Testing Utilities](./testing.md) — mock client setup and fake data policy.
- [Release and Migration Checklist](./release-checklist.md) — release process
  and versioning.
- [Acceptance Criteria Audit](./acceptance-criteria-audit.md) — criterion-level
  implementation, test, documentation, and status evidence.
- [API Reference](./api-reference.md) — documentation update guidelines.
