# Acceptance Criteria Traceability

This document defines the completion table format used in Aegis SDK pull requests to map each acceptance criterion from a linked issue to concrete implementation evidence and tests.

Filling out this table is part of the [PR Evidence Checklist](pr-evidence-checklist.md) (Section 6). It helps contributors self-evaluate before submission and helps reviewers verify completeness before the GrantFox evaluation period.

---

## Why a Table Instead of a Checklist

A checkbox alone — `[x] Criterion met` — tells a reviewer nothing about *how* it was met. The completion table requires a brief evidence entry and a test reference for each criterion, making gaps immediately visible. A row with empty evidence is a signal that the work is incomplete or undocumented.

---

## Table Format

Copy this template into the PR description's Section 6 and fill in one row per acceptance criterion from the linked issue.

```markdown
| # | Acceptance Criterion | Status | Implementation Evidence | Tests |
|---|---|---|---|---|
| 1 | <!-- criterion text --> | ✅ Done / ⚠️ Partial / ❌ Not done | <!-- file path, function name, or brief description --> | <!-- test file and test name, or "N/A — docs only" --> |
| 2 | <!-- criterion text --> | ✅ Done / ⚠️ Partial / ❌ Not done | <!-- file path, function name, or brief description --> | <!-- test file and test name, or "N/A — docs only" --> |
```

### Column definitions

| Column | What to write |
|---|---|
| **#** | Sequential number matching the issue's criterion list. |
| **Acceptance Criterion** | Copy the criterion text verbatim from the issue. Do not paraphrase. |
| **Status** | `✅ Done` — fully addressed. `⚠️ Partial` — partially addressed; explain in Reviewer Notes. `❌ Not done` — not addressed in this PR; link a follow-up issue. |
| **Implementation Evidence** | The specific file(s), function(s), or section(s) that satisfy the criterion. A file path and line reference is ideal. For documentation changes, name the document and section. |
| **Tests** | The test file and test name(s) covering this criterion. For documentation-only or config-only criteria, write `N/A — docs only` or `N/A — config only` with a brief justification. |

---

## Worked Example

**Issue:** Add a `getRedemptionStatus` method to `InvestorModule`.

**Acceptance criteria from the issue:**
1. Method returns the current redemption status for a given investor address.
2. Method returns `null` when no redemption request is on record.
3. Method throws `PortfolioError` on RPC failure.
4. API reference documentation is updated.

**Completed table:**

| # | Acceptance Criterion | Status | Implementation Evidence | Tests |
|---|---|---|---|---|
| 1 | Method returns the current redemption status for a given investor address | ✅ Done | `src/investor/portfolio.ts` — `getRedemptionStatus()`, lines 142–158 | `tests/investor.test.ts` — `"returns status when a redemption request exists"` |
| 2 | Method returns `null` when no redemption request is on record | ✅ Done | `src/investor/portfolio.ts` — `getRedemptionStatus()` null branch, line 151 | `tests/investor.test.ts` — `"returns null when no redemption request exists"` |
| 3 | Method throws `PortfolioError` on RPC failure | ✅ Done | `src/investor/portfolio.ts` — catch block, lines 154–157 | `tests/investor.test.ts` — `"throws PortfolioError on RPC failure"` |
| 4 | API reference documentation is updated | ✅ Done | `docs/api-reference.md` — new `getRedemptionStatus` section | N/A — docs only |

---

## Handling Incomplete Criteria

Not every PR needs to close every criterion. The table format is designed to make partial completion explicit rather than hidden.

### Partial completion (`⚠️ Partial`)

Use `⚠️ Partial` when the criterion is addressed in principle but something is missing — for example, a method is implemented but only the happy-path test exists.

- Mark the row `⚠️ Partial`.
- Add a brief note in the **Implementation Evidence** or **Tests** column explaining what is missing.
- Add a follow-up item in the PR's Reviewer Notes section.
- Use `Relates to #N` instead of `Closes #N` in the PR description so the issue stays open.

**Example:**

| # | Acceptance Criterion | Status | Implementation Evidence | Tests |
|---|---|---|---|---|
| 3 | Method throws `PortfolioError` on RPC failure | ⚠️ Partial | `src/investor/portfolio.ts` — catch block present | Happy-path test only; error-path test missing — tracked in #87 |

### Not done (`❌ Not done`)

Use `❌ Not done` when a criterion is entirely out of scope for this PR.

- Mark the row `❌ Not done`.
- Leave Implementation Evidence and Tests blank or write `Deferred`.
- Link a follow-up issue in the Reviewer Notes section.
- Use `Relates to #N` in the PR description.

**Example:**

| # | Acceptance Criterion | Status | Implementation Evidence | Tests |
|---|---|---|---|---|
| 4 | API reference documentation is updated | ❌ Not done | Deferred | Deferred — tracked in #88 |

> **Note for GrantFox evaluation:** Criteria marked `⚠️ Partial` or `❌ Not done` will be evaluated accordingly. A PR that honestly marks two criteria as incomplete is evaluated more favourably than one that checks everything off without delivering it.

---

## Quick Reference

| Status | Meaning | PR closing keyword |
|---|---|---|
| ✅ Done | Criterion fully addressed with evidence and tests | `Closes #N` (if all criteria are Done) |
| ⚠️ Partial | Criterion partially addressed; gaps documented | `Relates to #N` |
| ❌ Not done | Criterion deferred to a follow-up PR | `Relates to #N` |

---

## Related Documents

- [PR Evidence Checklist](pr-evidence-checklist.md) — full checklist requirements for every PR submission.
- [Self-Review Template](self-review-template.md) — pre-submission checklist to complete before opening a PR.
- [Contributor Evaluation Policy](contributor-evaluation-policy.md) — how GrantFox evaluates contributions and what partial completion means for payment.
- [Contribution Quality Examples](low-effort-pr-examples.md) — before/after examples of acceptable and unacceptable contributions.
