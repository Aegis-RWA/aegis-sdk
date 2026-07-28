# Contributor Evaluation Policy

> **Effective Date:** July 2026
>
> This document defines how contributions to the Aegis SDK are evaluated after merge and outlines expectations for all contributors participating in compensated contribution programs.

---

## 1. Overview

Aegis SDK welcomes contributions from the open-source community. To maintain code quality and ensure fair evaluation, all pull requests undergo a structured review process **before and after merge**. This policy clarifies that merging a pull request does **not** automatically guarantee payment approval through GrantFox or any other evaluation platform.

---

## 2. Merged PRs and Payment Approval

### 2.1 Merge Does Not Equal Approval

A merged pull request indicates that the contribution has been accepted into the codebase. However, **merge status alone does not constitute approval for payment**. Compensation decisions are made independently during the GrantFox evaluation period based on the criteria outlined in this document.

### 2.2 GrantFox Evaluation Process

All contributions submitted for compensation are evaluated through [GrantFox](https://grantfox.io) after the pull request has been merged. The evaluation considers:

- **Code Quality** — Is the implementation clean, well-structured, and consistent with the SDK's existing patterns?
- **Test Coverage** — Are meaningful unit tests included in `tests/` that cover both success and failure paths?
- **CI Pipeline Status** — Do all continuous integration checks pass, including TypeScript compilation and runtime compatibility gates (`npm run check`)?
- **Issue Completion** — Does the contribution fully address every acceptance criterion listed in the linked issue?
- **Documentation** — Are relevant docs updated (see `docs/api-reference.md` and the checklist in `CONTRIBUTING.md`)?

> **Important:** Partial implementations, contributions that skip tests, or PRs that leave acceptance criteria unmet may be merged for incremental progress but will be evaluated accordingly during the GrantFox review.

---

## 3. Contributor Expectations

### 3.1 Self-Review Before Submission

Before opening a pull request, contributors must perform a thorough self-review:

- [ ] Run `npm run check` locally and confirm all steps pass (build, tests, compatibility).
- [ ] Run `npm run lint` and `npm run format` to ensure code style compliance.
- [ ] Verify that every acceptance criterion in the linked issue is addressed.
- [ ] Confirm that new public methods have corresponding entries in `docs/api-reference.md`.
- [ ] Review your own diff for dead code, debugging artifacts, and placeholder values.

### 3.2 Testing Requirements

All new functionality **must** include unit tests. Contributions without adequate test coverage will not receive full evaluation credit. Specifically:

- Write tests in the `tests/` directory following existing naming conventions.
- Use the mock client from `@aegis/sdk/testing` for predictable SDK responses (see `docs/testing.md`).
- Cover both expected behavior and edge cases (error handling, boundary conditions, invalid inputs).
- Ensure tests are deterministic — no reliance on external services or network calls.

### 3.3 CI Pipeline Compliance

The Aegis SDK enforces a continuous integration gate on every pull request. Contributors must ensure:

- The `npm run check` script passes, which runs:
  - `npm run build` — TypeScript compilation with zero errors.
  - `npm test -- --runInBand` — Full test suite execution.
  - `npm run test:compat` — Runtime compatibility verification across supported Node.js versions.
- No existing tests are broken by the contribution.
- No CI workarounds or skipped checks are introduced.

### 3.4 Branching and Commit Conventions

- Use descriptive branch prefixes: `feat/`, `fix/`, `docs/`, or `chore/`.
- Write clear, conventional commit messages (e.g., `feat: add investor redemption method`).
- Keep commits focused — one logical change per commit.

---

## 4. Maintainer Review Standards

Maintainers evaluate pull requests using the following criteria before and after merge:

| Criterion | What Maintainers Look For |
|---|---|
| **Correctness** | Does the code do what the issue asks for? Are edge cases handled? |
| **Test Quality** | Are tests meaningful (not trivial assertions)? Do they cover failure paths? |
| **Code Style** | Does the code match the SDK's existing conventions and formatting? |
| **Documentation** | Are public API changes reflected in `docs/api-reference.md`? |
| **Scope** | Does the PR stay within the scope of the linked issue? |
| **Security** | Are there any exposed secrets, unsafe type assertions, or unvalidated inputs? |

Maintainers may request changes even on merged PRs if post-merge review identifies issues. Such feedback will be factored into the GrantFox evaluation.

---

## 5. Payment Period Conduct

### 5.1 Evaluation Timeline

GrantFox evaluations occur on a defined schedule after contribution periods close. Contributors will be notified of outcomes through the GrantFox platform.

### 5.2 Communication Guidelines

During active payment and evaluation periods:

- **Do not** spam community channels (Discord, GitHub Discussions, or other platforms) requesting payment status updates.
- **Do not** open GitHub issues or PRs solely to inquire about payment timelines.
- **Do** check the GrantFox platform directly for evaluation status.
- **Do** reach out to maintainers through appropriate private channels only if there is a legitimate concern or discrepancy.

Repeated violations of these communication guidelines may impact future contribution evaluations.

---

## 6. Evaluation Outcomes

After the GrantFox evaluation, contributions will receive one of the following outcomes:

| Outcome | Description |
|---|---|
| **Approved** | The contribution meets all quality standards and acceptance criteria. Payment is processed. |
| **Partial** | The contribution addresses some but not all criteria. Payment may be adjusted proportionally. |
| **Revisions Requested** | The contribution requires additional work before approval. A follow-up PR may be requested. |
| **Declined** | The contribution does not meet minimum standards. Detailed feedback is provided. |

---

## 7. Summary

| Principle | Detail |
|---|---|
| Merged ≠ Paid | Merging a PR does not guarantee compensation. |
| Quality Matters | Code quality, tests, and CI status are primary evaluation factors. |
| Complete the Issue | All acceptance criteria must be addressed for full credit. |
| Self-Review First | Run the full check suite and review your own code before submitting. |
| Respect the Process | Do not spam channels during evaluation periods. |
| GrantFox is Final | Evaluation outcomes are determined through the GrantFox platform. |

---

## 8. Questions

For questions about this policy, open a GitHub Discussion in the Aegis SDK repository or contact the maintainers through the designated communication channels.
