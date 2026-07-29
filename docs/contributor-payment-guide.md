# Aegis SDK Contributor Payment Expectation Guide

> **Last updated:** 2026-07-28
>
> This guide explains how GrantFox evaluation and payment work for Aegis SDK contributors,
> what criteria determine payment eligibility, and how to maximize the chance of a
> successful payout after your PR is merged.

---

## 1. How Payment Works

Contributions to the Aegis SDK through GrantFox are evaluated **after** the pull request
is merged. Merge approval by maintainers is **not** the same as payment approval.

The flow is:

```
You open a PR → Maintainer reviews → PR merged → GrantFox evaluates → Payment decision
```

Each stage has independent criteria. A merged PR can still fail the GrantFox evaluation
if it doesn't meet the quality and completeness standards defined in this guide.

---

## 2. Evaluation Criteria

GrantFox evaluates every merged PR against these dimensions:

### 2.1 Code Quality

- Is the implementation clean, well-structured, and consistent with existing SDK patterns?
- Are TypeScript types strict and meaningful (no `any`, no loose typing)?
- Does the code avoid breaking existing public API contracts?
- Is error handling complete with typed error classes where appropriate?

### 2.2 Test Coverage

- Are meaningful unit tests included in `tests/`?
- Do tests cover both success paths and failure/edge-case paths?
- Do tests validate actual SDK behavior, not just type structure?
- Are test descriptions clear enough that a reviewer understands the scenario?

### 2.3 CI Pipeline

- Do all CI checks pass: TypeScript compilation (`tsc --noEmit`), lint (`npm run lint`),
  and runtime compatibility gates (`npm run check`)?
- If CI fails, is there an explanation in the PR description?

### 2.4 Issue Completion

- Does the PR address **every** acceptance criterion listed in the linked issue?
- Are partial solutions flagged clearly with a follow-up issue reference?
- Does the PR description explain how each criterion is satisfied?

### 2.5 Documentation

- Are relevant docs updated in `docs/`?
- If the PR adds a new module or endpoint, is there a corresponding doc entry?
- Do code examples in docs compile and run correctly?

---

## 3. What Does NOT Guarantee Payment

The following actions **do not** guarantee payment approval:

| Action | Why It's Not Enough |
|--------|-------------------|
| PR was merged | Merge means code was accepted, not that it meets GrantFox quality bar |
| PR was reviewed by a maintainer | Reviews focus on correctness, not everything GrantFox evaluates |
| PR passed CI | CI verifies compilation, not test quality or documentation completeness |
| PR was approved by multiple reviewers | Same as above — multiple approvals don't change GrantFox's independent evaluation |
| The work was "hard" or time-consuming | Effort alone is not a criterion — output quality is what matters |

---

## 4. How to Maximize Payment Chance

### Before opening a PR

1. **Read the issue thoroughly** — every acceptance criterion matters. If criteria are
   ambiguous, ask for clarification on the issue before coding.
2. **Check existing patterns** — look at merged PRs in the same area for style,
   test structure, and doc format.
3. **Write tests first** — a PR with no tests or minimal tests will almost certainly
   fail evaluation.

### In the PR description

1. **Link the issue** with `Closes #N` (mandatory — no link means no evaluation).
2. **List what was done** — match each acceptance criterion to the implementation.
3. **Note what was NOT done** — if a criterion couldn't be addressed, say why and
   reference a follow-up issue.
4. **Include evidence** — paste CI output, test run results, or type-check logs.

### After the PR is merged

1. **Monitor the GrantFox dashboard** for evaluation status.
2. **Do not reopen** — if evaluation fails, the feedback will explain why. Address
   those issues in a **new** PR, not the same one.
3. **Be patient** — evaluation is not instant. Allow 24-48 hours after merge.

---

## 5. Common Reasons for Evaluation Failure

| Reason | How to Avoid |
|--------|-------------|
| No tests added | Always include tests for every PR, even documentation changes |
| Tests don't cover edge cases | Test empty/missing input, invalid parameters, error responses |
| CI doesn't pass | Run `tsc --noEmit` and `npm run check` before pushing |
| Missing or incomplete docs | Check `docs/` for files related to your change and update them |
| PR description is vague | List acceptance criteria and how each was met |
| Code is inconsistent with patterns | Review existing code in the same module before writing yours |
| Single large commit with no explanation | Use descriptive commit messages per logical change |

---

## 6. Questions

If you have questions about evaluation or payment, ask on the issue before coding.
Maintainers and GrantFox support can clarify whether a specific approach meets the
quality bar.
