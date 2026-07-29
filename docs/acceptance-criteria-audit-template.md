# Acceptance Criteria Audit Template

## Status

**Applies to:** Aegis SDK (`@aegis/sdk`)
**Companion to:** [Pull Request Evidence Checklist](./pr-evidence-checklist.md), Section 6

---

## Purpose

Section 6 of the [PR Evidence Checklist](./pr-evidence-checklist.md#6-acceptance-criteria-coverage)
requires every acceptance criterion from the linked issue to be addressed. A
plain checked-off list makes it easy to mark a criterion done without
showing *how*. This template replaces the checklist with a per-criterion
audit row, so a reviewer can verify completeness without re-reading the
whole diff.

---

## How to use this template

For each acceptance criterion in the linked issue, copy the criterion text
verbatim and fill in one row. Do not merge two criteria into one row, even
if a single change satisfies both -- reviewers check rows against the issue
one at a time.

| Criterion | Evidence | Status |
|---|---|---|
| *(copied verbatim from the issue)* | *(file/diff/test that satisfies it)* | *(see status values below)* |

| Requirement | Every row must show implementation evidence, and test or documentation evidence where applicable. |
|---|---|
| **Why** | A criterion marked "done" with no evidence is unverifiable -- the reviewer either re-derives it from the diff themselves or takes it on faith. Neither scales. |
| **How to satisfy** | Point to something concrete: a file path and symbol name, a test name plus the command that runs it, or a doc section. If none of those apply, say why in the evidence cell rather than leaving it blank. |
| **Acceptable evidence** | `src/client.ts` exports `X` -- not "implemented client changes." `tests/client.test.ts::handles timeout` -- not "added tests." |

---

## Status values

| Status | Meaning |
|---|---|
| **Done** | Criterion is fully implemented and its evidence is verifiable in this PR. |
| **Partial** | Some but not all of the criterion is addressed in this PR. |
| **Deferred** | Intentionally out of scope for this PR; requires a follow-up. |
| **N/A** | Criterion does not apply to this change -- explain why in the evidence cell. |

A criterion should not be marked **Done** if its evidence cell is empty or
vague. If you are unsure whether something counts as sufficient evidence,
under-claim (mark **Partial**) rather than over-claim.

---

## Handling incomplete criteria

If any row is **Partial** or **Deferred**:

1. The PR description must use `Relates to #N`, not `Closes #N` or `Fixes #N`.
2. The evidence cell for that row states what remains.
3. If a follow-up issue already exists, link it. If not, say so explicitly
   so a maintainer can decide whether to open one -- don't silently drop it.

A PR should never claim an issue is fully resolved (`Closes #N`) while any
row in its own audit table says otherwise.

---

## Worked example

Issue acceptance criteria:
- Add retry logic to `fetchBalance`.
- Document the retry behaviour.

Audit:

| Criterion | Evidence | Status |
|---|---|---|
| Add retry logic to `fetchBalance`. | `src/client.ts`: `fetchBalance` now retries up to 3 times on `NetworkError`; see `tests/client.test.ts::retries on network error`. | Done |
| Document the retry behaviour. | `docs/network-failures.md` section "Retry policy" describes the 3-attempt backoff. | Done |

If retry logic had been added without updating the docs criterion, that
second row would read:

| Criterion | Evidence | Status |
|---|---|---|
| Document the retry behaviour. | Not yet written; tracking in follow-up. | Deferred |

-- and the PR description would say `Relates to #N`, not `Closes #N`.

---

## Related Documentation

- [Pull Request Evidence Checklist](./pr-evidence-checklist.md) -- the full
  six-item PR requirement list this template supports.
- [Contributing Guide](../CONTRIBUTING.md) -- development workflow and PR
  process.
