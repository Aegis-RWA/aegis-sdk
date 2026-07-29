# Issue Approval Readiness Checklist

Use this checklist before marking an Aegis SDK issue ready for maintainer evaluation, campaign evaluation, or payout review. A merged pull request is still subject to evaluation: reviewers may check whether the implementation satisfies the original issue, whether tests and CI prove the behavior, and whether limitations were disclosed.

## Readiness Checklist

| Area | Ready when | Evidence to include |
| --- | --- | --- |
| Implementation completeness | The PR implements every in-scope behavior from the issue and avoids unrelated changes. | Summary of changed files and the behavior each file supports. |
| Acceptance criteria | Every criterion from the issue is addressed or explicitly deferred. | Checked criteria with file paths, test names, or a follow-up issue for deferred work. |
| Tests | Runtime behavior changes have focused happy-path and failure-mode coverage. | New or updated test files plus the command output that ran them. |
| CI status | Required CI checks are green, or an external failure is documented with evidence. | Link to the green run or a failing job URL with unrelated-failure explanation. |
| Documentation | Public SDK behavior, contributor flow, or operational expectations are documented. | README, docs, API reference, or migration-guide links from the PR. |
| Known limitations | Any edge case intentionally left out is visible to reviewers before merge. | Reviewer notes that state the limitation, risk, and follow-up path. |

## Contributor Self-Review

Before requesting review, confirm:

- [ ] The PR uses `Closes #<issue>` or explains partial scope with `Relates to #<issue>`.
- [ ] The implementation matches the issue scope and does not bundle unrelated cleanup.
- [ ] Acceptance criteria are copied into the PR description and checked one by one.
- [ ] Tests cover the expected behavior and one meaningful negative path when code changes.
- [ ] Docs-only or metadata-only changes include a valid no-test justification.
- [ ] `npm run verify` passed, or the PR explains why a narrower command is sufficient.
- [ ] All GitHub Actions checks are green, or unrelated failures are linked and explained.
- [ ] Known limitations, compatibility notes, or follow-up issues are listed before review.

## Reviewer Evaluation

Reviewers should treat the issue as ready only when:

1. The diff maps clearly to the issue's requested outcome.
2. The PR evidence proves implementation, tests, docs, and CI status.
3. The author has not hidden remaining work behind a merge.
4. Limitations are explicit enough for maintainers to decide whether they block approval.
5. Campaign or payout reviewers can inspect the PR without asking for missing context.

## Merged Does Not Mean Evaluated

A merge confirms that a maintainer accepted the repository change. It does not automatically prove reward eligibility, campaign completion, or payment readiness. Evaluation may still consider:

- Whether the issue was assigned or otherwise eligible under campaign rules.
- Whether the PR closed the issue's acceptance criteria rather than only improving nearby docs or code.
- Whether test and CI evidence was present at review time.
- Whether follow-up fixes were required after merge.
- Whether the submitted evidence is public, durable, and easy to verify.

## Related Documentation

- [Pull Request Evidence Checklist](pr-evidence-checklist.md)
- [Test-First Contribution Guide](test-first-contribution.md)
- [CI Pass Requirements](ci-pass-requirements.md)
- [Verification Command](verification.md)