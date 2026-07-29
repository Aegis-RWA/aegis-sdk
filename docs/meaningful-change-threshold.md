# Meaningful Change Threshold Guide

## Status

**Applies to:** Aegis SDK (`@aegis/sdk`)
**Last updated:** 2026-07-29

---

## Purpose

Some pull requests submitted to the Aegis SDK contain very little code —
sometimes only a few lines — without actually solving the issue they claim to
close. Line count alone is not the standard reviewers or contributors should
use to judge whether a PR is meaningful. This guide defines what makes a
change **meaningful**, distinguishes small-but-complete changes from
small-but-incomplete ones, and gives reviewers a concrete process for
assessing scope.

This guide complements, and does not replace, the
[Low-Effort PR Examples & High-Quality Standards](./low-effort-pr-examples.md)
document. That document catalogues anti-patterns (untested code, failing CI,
stale docs). This guide focuses specifically on the "is this change big
enough / real enough" question, which those anti-pattern categories don't
fully answer on their own.

---

## The Core Principle: Size Is Not the Standard

A one-line fix and a two-hundred-line feature can both be meaningful. A
one-line fix and a two-hundred-line feature can both be worthless. The line
count of a diff says nothing about whether it:

1. **Solves the actual problem** described in the linked issue, not a
   symptom or an adjacent detail of it.
2. **Is complete** — no partial implementation, no `// TODO` stand-ins for
   the core logic, no happy-path-only handling.
3. **Is tested** — the new/changed behavior is covered by tests that would
   fail if the change were reverted.
4. **Is aligned with the issue's acceptance criteria** — every criterion in
   the linked issue is addressed, or the PR explicitly says which ones
   aren't and why.

A change that satisfies all four of these is meaningful regardless of how
many lines it touches. A change that fails any of them is insufficient
regardless of how many lines it touches.

---

## Small but Complete vs. Small but Incomplete

The distinction reviewers need to make is not "small vs. large" — it's
**"complete vs. incomplete."** Both examples below are small. Only one is
acceptable.

### Example A — Small and Complete (Acceptable)

Issue: "`InvestorModule.getPortfolio` throws an unhandled exception when
`assetContractIds` contains a duplicate contract ID, instead of de-duplicating
or returning a clear error."

```typescript
// src/investor/portfolio.ts
const targetAssetContracts = options.assetContractIds && options.assetContractIds.length > 0
  ? Array.from(new Set(options.assetContractIds))
  : [this.client.contractId];
```

```typescript
// tests/investor.test.ts
test('getPortfolio de-duplicates repeated assetContractIds', async () => {
  const portfolio = await investor.getPortfolio(ADDRESS, {
    assetContractIds: [CONTRACT_A, CONTRACT_A, CONTRACT_B],
  });
  expect(portfolio.holdings).toHaveLength(2);
  expect(portfolio.holdings.map((h) => h.assetId)).toEqual([CONTRACT_A, CONTRACT_B]);
});
```

Why this is acceptable even though it's a one-line production change:

- It fixes the root cause described in the issue, not a symptom.
- The behavior change is covered by a test that fails without the fix and
  passes with it.
- No further work is implied — there's no follow-up TODO, no unhandled case
  left over.
- The PR description would reference `Closes #N` and every acceptance
  criterion in the issue is satisfied.

### Example B — Small and Incomplete (Insufficient)

Same issue as above. This diff is roughly the same size:

```typescript
// src/investor/portfolio.ts
const targetAssetContracts = options.assetContractIds ?? [this.client.contractId];
// TODO: handle duplicate contract IDs
```

Why this fails, despite touching about the same number of lines:

- It does not solve the problem in the issue — duplicates are still passed
  through unchanged.
- It leaves a `// TODO` in place of the actual fix.
- No test was added, so there is nothing proving the described bug is fixed.
- A reviewer approving this would be approving the *appearance* of a fix,
  not an actual one.

The two diffs are nearly identical in size. Only one of them is a real fix.
Size was never the differentiator — completeness was.

---

## More Insufficient-Change Patterns

These are common shapes of PRs that look like progress but don't clear the
threshold, beyond the TODO-stub case above:

- **Renaming or reformatting only.** Renaming a variable, reordering
  imports, or reflowing a docstring, submitted as if it resolves a
  functional issue. Nothing observable about the SDK's behavior changed.
- **Test-only "fixes."** Loosening an assertion (e.g. changing
  `expect(x).toBe(3)` to `expect(x).toBeDefined()`) to make a failing test
  pass, instead of fixing the code the test was correctly catching a bug in.
- **Config/metadata churn.** Bumping a `package.json` field, editing
  `.gitignore`, or tweaking a GitHub Actions YAML key with no connection to
  the linked issue's acceptance criteria.
- **Copy-pasted or unmodified boilerplate.** Adding a new doc file or test
  file that is a near-verbatim copy of an existing one with names swapped,
  where the actual new content the issue asked for was never written.
- **Silent scope reduction.** Claiming `Closes #N` while only handling one
  of several acceptance criteria in the issue, without disclosing this in
  the PR description (see the "Partial completion" rules in the
  [PR Evidence Checklist](./pr-evidence-checklist.md#6-acceptance-criteria-coverage)).

None of these are disqualified because of their diff size — several of them
could be large diffs (e.g. a big boilerplate copy-paste). They're
disqualified because they don't address the issue.

---

## Reviewer Assessment Guidance

When reviewing a PR, don't start by counting lines changed. Instead, work
through this sequence:

1. **Read the linked issue first.** Identify every acceptance criterion
   before opening the diff. This prevents anchoring on "the diff looks
   reasonable" without a baseline to compare it against.
2. **Map each acceptance criterion to a concrete part of the diff.** For
   each criterion, find the specific lines, test, or doc section that
   satisfies it. If you can't point to anything, the criterion isn't met —
   regardless of how much other code changed.
3. **Check for root cause vs. symptom.** Ask whether the change addresses
   *why* the bug/gap exists, or just papers over one observed symptom of it.
   A fix that only handles the exact repro steps in the issue, but leaves
   the same underlying defect reachable another way, is incomplete.
4. **Verify tests fail without the fix.** A test suite that already passes
   before the change is applied proves nothing about the change. Reviewers
   should be able to mentally (or actually) revert the production diff and
   confirm the new test would then fail.
5. **Check for leftover incompleteness markers.** `// TODO`, `// FIXME`,
   stub return values (`return null`, `return {}`), or commented-out code in
   the core logic path are signals the change isn't finished, independent of
   size.
6. **Judge documentation-only and config-only PRs by content, not diff
   size.** A five-line `.gitignore` change is fine if that's genuinely what
   the issue asked for; a five-line doc stub that doesn't actually explain
   anything is not, even though both are "small."
7. **When in doubt, ask for the missing piece, don't reject on size alone.**
   If a PR is small but you can't tell whether it's complete, request that
   the contributor point to the specific test or diff line that satisfies
   each acceptance criterion (see the
   [PR Evidence Checklist](./pr-evidence-checklist.md)) rather than assuming
   it's insufficient because it's short.

---

## Quick Reference

| Question | Meaningful | Insufficient |
|---|---|---|
| Does it address the issue's root cause? | Yes | No — symptom-only or unrelated |
| Are all acceptance criteria met (or partial scope disclosed)? | Yes, or `Relates to #N` with remaining items listed | Silently partial, claims `Closes #N` |
| Is there a test that fails without the fix? | Yes | No test, or a loosened assertion |
| Is core logic free of `TODO`/stub returns? | Yes | Stubbed or deferred |
| Diff size | Irrelevant | Irrelevant |

---

## Related Documentation

- [Low-Effort PR Examples & High-Quality Standards](./low-effort-pr-examples.md) — broader anti-pattern catalogue (untested code, failing CI, stale docs).
- [PR Evidence Checklist](./pr-evidence-checklist.md) — required evidence sections for every PR, including acceptance criteria coverage.
- [Pull Request Reviewer Checklist](./reviewer-checklist.md) — full review checklist covering code quality, tests, CI, docs, and security.
- [Contributor Evaluation Policy](./contributor-evaluation-policy.md) — how merged PRs are evaluated for compensation.
- [Self-Review Template](./self-review-template.md) — checklist contributors should run through before opening a PR.
