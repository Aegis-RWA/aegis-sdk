## Description

<!-- Provide a concise summary of the changes and their motivation. -->

**Closes:** #<!-- issue number -->

---

## Evidence Checklist

Every pull request to the Aegis SDK must satisfy the items below.
Replace each `[ ]` with `[x]` when the requirement is met.
See [`docs/pr-evidence-checklist.md`](../docs/pr-evidence-checklist.md) for full guidance on each item.

### 1. Issue Reference

- [ ] This PR references a tracked issue (e.g. `Closes #123` or `Relates to #123`).
- [ ] The linked issue's acceptance criteria are copied into Section 6 below.

### 2. Implementation Summary

- [ ] A clear description of **what** changed is provided above.
- [ ] A brief explanation of **why** this approach was chosen is included.
- [ ] All files added, modified, or removed are listed or summarised.

### 3. Tests

- [ ] New or updated unit tests cover every added or changed public method.
- [ ] Tests use the mock client (`@aegis/sdk/testing`) where appropriate.
- [ ] If tests are not applicable, a justification is provided below.

<details>
<summary>Test justification (if no tests were added)</summary>

<!-- Explain why tests are not needed for this change (e.g. documentation-only, config change). -->

</details>

### 4. Commands Run

Paste the **exact** terminal output for each command. Reviewers must be able
to verify that the suite passed on your machine before CI ran.

```bash
# Build
npm run build

# Lint
npm run lint

# Tests
npm test

# Full release gate (includes build + tests + compatibility)
npm run check
```

<details>
<summary>Command output</summary>

```
<!-- Paste terminal output here -->
```

</details>

### 5. CI Status

- [ ] All GitHub Actions checks pass on this PR.
- [ ] If a CI step failed, a root-cause explanation is provided below.

<details>
<summary>CI failure notes (if applicable)</summary>

<!-- Explain any CI failures and why they are unrelated to this change, or how you resolved them. -->

</details>

### 6. Acceptance Criteria Coverage

Copy the acceptance criteria from the linked issue and check off each item
that this PR satisfies.

- [ ] <!-- Criterion 1 from the issue -->
- [ ] <!-- Criterion 2 from the issue -->
- [ ] <!-- Add more as needed -->

---

## Reviewer Notes

<!-- Optional: call out areas that need careful review, known trade-offs, or follow-up work. -->
