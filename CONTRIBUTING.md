# Contributing to Aegis SDK

We welcome open-source contributions! As middleware, this SDK is critical for the frontend developer experience.

## Development Workflow
1. **Fork & Clone:** Fork the repo and clone it locally.
2. **Install Dependencies:** Run `npm install`.
3. **Branching:** Use `feat/`, `fix/`, or `chore/` prefixes.
4. **Testing:** You MUST write unit tests in `tests/` for any new methods added. PRs without test coverage will be rejected. For predictable SDK responses without live RPC, use the mock client from `@aegis/sdk/testing` (see `docs/testing.md`).
5. **Formatting:** Ensure `npm run lint` and `npm run format` pass before opening a PR.

Search the codebase for `// TODO:` comments to find areas that need immediate help!

## Updating API Reference Documentation

When you add or change a public method on `ComplianceModule`, `AssetModule`, `InvestorModule`, or an exported utility/type, update `docs/api-reference.md` (and `docs/investor-portfolio.md` if the investor read model changes). Review checklist:

- [ ] The signature block matches the method's actual TypeScript signature (parameter names, types, return type).
- [ ] The Parameters section lists every parameter, including optional ones and their defaults.
- [ ] The Returns section states what the `Promise` resolves to, including any fallback/sentinel values (e.g. `false`, `null`, a fallback object) — not just the "happy path" type.
- [ ] The Errors section lists every distinct throw path in the method body, and states whether it's a raw underlying SDK error, a plain `Error`, or a typed error class (e.g. `PortfolioError`).
- [ ] The example uses only placeholder keys/addresses (`G...`, `C...`, `S...`) — never a real secret key or mainnet contract ID.
- [ ] Anything the source leaves ambiguous, incomplete, or marked with a `// TODO` is called out as an explicit note rather than assumed or omitted.
- [ ] If the change affects compliance/whitelist-gated behavior, the compliance disclaimer at the top of `docs/api-reference.md` still accurately describes it.