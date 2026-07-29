# CI Pass Requirements

Aegis SDK pull requests are evaluated only after the required CI checks are green or an unrelated infrastructure failure is clearly documented. Failing CI can delay review, affect campaign or maintainer evaluation, and prevent approval until the author resolves the failure.

## Required Passing Checks

Before requesting review, contributors are expected to make these checks pass locally and in GitHub Actions:

| Check | Local command | Required evidence |
| --- | --- | --- |
| Lint | `npm run lint` | No ESLint errors in SDK source files. |
| Format | `npm run format` | Formatting applied or no formatting diff remains. |
| Build | `npm run build` | TypeScript emits without type errors. |
| Unit tests | `npm test -- --runInBand` | All focused and existing Jest tests pass. |
| Runtime compatibility | `npm run test:compat` | Package exports work in supported runtimes. |
| Full verification | `npm run verify` | The complete pre-submit gate finishes successfully. |

If the CI workflow uses a narrower command than `npm run verify`, the PR should still include the broader local verification output or explain why a docs-only/no-code change does not need it.

## Common Failure Types

- **TypeScript build failures:** usually missing exports, changed method signatures, or mock data no longer matching SDK types.
- **Unit test failures:** usually unhandled negative paths, changed receipt shapes, or mocks that do not represent the new behavior.
- **Runtime compatibility failures:** usually Node/browser API assumptions, package export drift, or missing generated `dist` artifacts.
- **Lint or format failures:** usually unused imports, inconsistent formatting, or generated edits that were not reviewed.
- **Dependency failures:** usually lockfile drift, unsupported Node versions, or install scripts that do not match CI.
- **Documentation-link failures:** usually renamed docs without updating README, CONTRIBUTING, or related cross-links.

## Contributor Fix Expectations

When a check fails, the contributor should:

1. Open the failing GitHub Actions log and identify the exact failed command.
2. Reproduce the failure locally with the matching command.
3. Push a focused fix instead of broad unrelated cleanup.
4. Re-run the focused command and then the full verification gate.
5. Update the PR description or a comment with the new passing command output.

A failure should not be ignored because the changed files look unrelated. If the failure is truly external to the PR, document the evidence: failed job URL, failing step, why the branch did not cause it, and whether a rerun was requested.

## Reviewer Responsibilities

Reviewers should verify that:

- CI is green before approval, or any external failure is explained with a concrete log link.
- The commands reported in the PR match the changed files and acceptance criteria.
- Tests cover both the expected success behavior and one meaningful failure mode when runtime behavior changes.
- Docs-only or metadata-only PRs include a valid no-test justification.
- A PR with failing required checks is returned for correction before merge.

## Related Guides

- [CI Failure Resolution Workflow](ci-resolution-workflow.md)
- [Failing CI Response Guide](ci-response-guide.md)
- [Verification Command](verification.md)
- [Pull Request Evidence Checklist](pr-evidence-checklist.md)