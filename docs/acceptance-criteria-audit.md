# Acceptance Criteria Audit

Use this audit in every pull request to map each issue acceptance criterion to
reviewable evidence. Copy one row per criterion into the pull request template;
do not combine criteria even when the same change satisfies several of them.

## Template

| Acceptance criterion | Implementation evidence | Test evidence | Documentation impact | Status |
|---|---|---|---|---|
| <!-- Copy the criterion verbatim from the issue. --> | <!-- Link to a file, symbol, or diff section and briefly explain how it satisfies the criterion. --> | <!-- Name the test and command, or explain why testing is not applicable. --> | <!-- Link the updated documentation, or state `None` with a reason. --> | <!-- Complete, Partial, Not started, or Not applicable --> |

## Status values

- **Complete** — the implementation and all applicable evidence are present in
  this pull request.
- **Partial** — the pull request addresses part of the criterion, but identified
  work remains.
- **Not started** — the criterion is intentionally outside this pull request.
- **Not applicable** — the criterion does not apply to the change; the evidence
  cell must explain why.

Do not mark a criterion **Complete** when its required test or documentation
evidence is missing. A short explanation such as "documentation-only change"
is acceptable test evidence when automated tests are not applicable.

## Incomplete criteria

If any criterion is **Partial** or **Not started**:

1. Use `Relates to #N` instead of `Closes #N` or `Fixes #N` in the pull request.
2. Describe the remaining work in the relevant evidence cell.
3. Link a follow-up issue when one exists, or ask the maintainer whether a
   follow-up should be created.
4. Do not represent the original issue as complete.

If a criterion cannot be completed because the requirement is unclear or
blocked, leave it incomplete and call out the blocker in **Reviewer Notes**.

## Example

| Acceptance criterion | Implementation evidence | Test evidence | Documentation impact | Status |
|---|---|---|---|---|
| Export the new client helper. | `src/index.ts` exports `createClient`. | `tests/index.test.ts` covers the public export; `npm test -- --runInBand`. | `README.md` includes an import example. | Complete |
| Document retry behaviour. | No implementation change is required. | Documentation-only; link check completed. | `docs/network-failures.md` documents retry limits. | Complete |
| Add browser retry telemetry. | Deferred because browser telemetry is outside this SDK change. Follow-up: #456. | Not run; implementation is deferred. | None until #456 is implemented. | Not started |

The audit complements the broader [Pull Request Evidence Checklist](pr-evidence-checklist.md);
it does not replace the required implementation summary, command output, or CI
status.
