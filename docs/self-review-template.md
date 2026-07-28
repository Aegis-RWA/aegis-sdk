# Self-Review Template

A checklist for Aegis SDK contributors to self-review their changes before opening a PR.

## Requirements
- [ ] Does the code implement the issue's acceptance criteria?
- [ ] Are all public APIs documented with JSDoc comments?
- [ ] Are types used correctly (no `any`, proper generics)?

## Tests
- [ ] Unit tests added for new methods?
- [ ] Do tests cover edge cases (empty, null, error states)?
- [ ] Do existing tests still pass?
- [ ] If mocks were changed, do tests still work?

## CI
- [ ] Ran `npm run check` (build + tests + compat)?
- [ ] Ran `npm run lint` (no errors)?
- [ ] Ran `npm run format` (consistent formatting)?

## Documentation
- [ ] README updated if CLI or usage changed?
- [ ] API reference updated if public methods changed?
- [ ] Changelog entry added if behavior changed?
- [ ] Inline comments explain non-obvious logic?

## Security & Compliance
- [ ] No hardcoded secrets or keys?
- [ ] Input validated and sanitized?
- [ ] Error messages don't leak sensitive info?
- [ ] Compliance/whitelist checks in place where needed?

## Examples
- [ ] Example in README still works?
- [ ] Any new examples added?

## PR Description
- [ ] Title follows conventional commits format?
- [ ] Description explains what and why?
- [ ] Closes #N references the issue number?
- [ ] Screenshots if UI changes?
