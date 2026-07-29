# Payment-Period Conduct

This document sets out the conduct expected of Aegis SDK contributors during and after payment evaluation periods.

---

## Why This Exists

Compensation decisions are made through [GrantFox](https://grantfox.io) on a defined schedule, not the moment a pull request is merged. Past evaluation periods have seen contributors repeatedly contacting maintainers and posting in community channels before checking whether their own contribution met the requirements. This creates noise for everyone and does not speed up the process.

---

## Before Raising a Payment Concern — Self-Review First

If you believe your contribution was evaluated incorrectly or not at all, work through this checklist before contacting anyone:

- [ ] Your PR was merged (merge ≠ approval; see [Contributor Evaluation Policy](contributor-evaluation-policy.md#2-merged-prs-and-payment-approval)).
- [ ] `npm run check` passed in CI — build, full test suite, and runtime compatibility gates are all green.
- [ ] Every acceptance criterion listed in the linked issue is addressed by your changes.
- [ ] New or changed public methods have entries in `docs/api-reference.md`.
- [ ] You have checked the **GrantFox platform directly** for your evaluation status.

If any item above is unresolved, address it before reaching out. Many apparent payment discrepancies are caused by incomplete contributions, failing CI, or unmet acceptance criteria — all of which are contributor responsibilities.

---

## Communication Rules During Evaluation Periods

**Do not:**

- Post repeated messages in Discord, GitHub Discussions, or any other community channel asking for payment status or updates.
- Open GitHub issues or PRs whose sole purpose is to inquire about payment timelines.
- Tag or directly message maintainers in public threads about payment status.
- Speculate publicly about other contributors' evaluation outcomes.

**Do:**

- Check the [GrantFox](https://grantfox.io) platform for your evaluation status — this is the authoritative source.
- Wait for the evaluation period to close before expecting an outcome.
- Reach out to maintainers through appropriate **private channels only** if you have a genuine, specific discrepancy that cannot be resolved through the platform (e.g., a merged PR that does not appear in the evaluation system at all).

---

## Evaluation Timeline

GrantFox evaluations run on a fixed schedule after each contribution period closes. The general flow is:

1. Contribution period closes.
2. GrantFox evaluation begins (code quality, tests, CI status, issue completion, documentation).
3. Outcomes are published on the GrantFox platform.
4. Payment is processed for approved contributions.

There is no mechanism to accelerate this schedule by contacting the maintainers. Inquiries that duplicate information already available on GrantFox will not receive a response.

---

## Consequences of Repeated Violations

Persistent spam or pressure during evaluation periods is taken seriously:

- A first incident will result in a direct warning.
- Continued violations may result in contributions being evaluated less favorably or the contributor being restricted from future participation.

This is not a punitive policy — it is a practical one. Maintainers have limited bandwidth, and protecting that bandwidth benefits every contributor.

---

## Related Documents

- [Contributor Evaluation Policy](contributor-evaluation-policy.md) — full policy covering merge vs. approval, GrantFox evaluation criteria, and outcome definitions.
- [Self-Review Template](self-review-template.md) — checklist to complete before opening a PR or raising a concern.
- [PR Evidence Checklist](pr-evidence-checklist.md) — required evidence for every pull request submission.
