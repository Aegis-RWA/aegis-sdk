# Payment-Period Communication Policy

## Status

**Applies to:** Aegis SDK (`@aegis/sdk`)
**Last updated:** 2026-07-29

---

## Purpose

A merged pull request is not a payment decision. Compensation for
contributions is determined separately, after merge, through the GrantFox
evaluation process described in the
[Contributor Evaluation Policy](./contributor-evaluation-policy.md). This
document sets clear, firm expectations for how contributors should — and
should not — communicate during payment and evaluation periods.

This policy exists because community channels can be flooded with repeated
complaints and payment-status requests when contributors assume that merge
alone guarantees payment. That assumption is incorrect, and the resulting
noise makes it harder for maintainers to run a fair evaluation process and
harder for other contributors to get help. This document exists so every
contributor has the same clear expectations up front.

---

## 1. Merge Is Not Payment

Merging a pull request means the contribution has been accepted into the
codebase. It does **not** mean payment has been approved. Payment decisions
are made independently, on their own timeline, through GrantFox. Treat these
as two separate processes, not one.

For the full breakdown of how contributions are evaluated for compensation,
see [Contributor Evaluation Policy §2](./contributor-evaluation-policy.md#2-merged-prs-and-payment-approval).

---

## 2. Self-Review Before Raising a Payment Concern

Before asking about payment status, or suggesting an evaluation outcome is
wrong, review your own contribution honestly against the standards it will
be judged by:

- Did the PR fully address every acceptance criterion in the linked issue,
  or only some of them? See the
  [Meaningful Change Threshold Guide](./meaningful-change-threshold.md) for
  how "small" and "incomplete" are different things, and the
  [PR Evidence Checklist](./pr-evidence-checklist.md) for what counts as
  proof of completeness.
- Did the PR include meaningful tests, not just trivial assertions?
- Did `npm run check` pass cleanly, with no unrelated failures glossed over?
- Was documentation updated where the change required it?

If you cannot answer "yes" to these honestly, the evaluation outcome you're
concerned about may be an accurate reflection of the contribution's scope
and quality, not an error. Self-review first; escalate only if a genuine
discrepancy remains after that review.

---

## 3. What Not to Do

The following behaviors are not acceptable during payment and evaluation
periods, regardless of how the contributor feels about the outcome:

- **Do not** post repeated payment-status requests in Discord, GitHub
  Discussions, issues, or any other community channel.
- **Do not** open a GitHub issue or pull request whose sole purpose is to ask
  about payment timing or dispute an evaluation outcome.
- **Do not** comment on unrelated issues or PRs to raise payment concerns.
- **Do not** pressure maintainers or reviewers for expedited evaluation.

Repeated violations of these expectations may affect the evaluation of
current and future contributions, as described in
[Contributor Evaluation Policy §5.2](./contributor-evaluation-policy.md#52-communication-guidelines).

---

## 4. What to Do Instead

- **Check GrantFox directly** for evaluation status. It is the source of
  truth for payment decisions, not community channels or maintainer
  replies.
- **Wait for the published evaluation timeline** described in
  [Contributor Evaluation Policy §5.1](./contributor-evaluation-policy.md#51-evaluation-timeline)
  before expecting a status update.
- **Raise a genuine discrepancy through the designated private channel**
  only — for example, if GrantFox shows no record of a contribution that
  was clearly merged. General "when will I get paid" questions are not a
  discrepancy.

---

## 5. Why This Policy Exists

This policy is not a judgment on any individual contributor. It exists
because unmanaged payment-status noise has a real cost: it crowds out
technical discussion in community channels, consumes maintainer time that
would otherwise go toward reviewing PRs, and creates pressure to rush
evaluations that are meant to be careful and fair. Following this policy
keeps the evaluation process functional for everyone, including you.

---

## Related Documentation

- [Contributor Evaluation Policy](./contributor-evaluation-policy.md) — full evaluation process, criteria, and outcomes.
- [Meaningful Change Threshold Guide](./meaningful-change-threshold.md) — how contribution scope and completeness are judged.
- [PR Evidence Checklist](./pr-evidence-checklist.md) — required evidence for every PR.
- [Self-Review Template](./self-review-template.md) — checklist to run before opening a PR.
