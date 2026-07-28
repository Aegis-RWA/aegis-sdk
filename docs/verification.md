# Verification Command

The `npm run verify` command runs all pre-submit checks in sequence, giving you a single command to validate your changes before pushing.

## Usage

```bash
npm run verify
```

If all steps pass, your changes are ready to submit.

## What it checks

Steps run in order, and the command stops on the first failure:

| Step | Command | What it checks |
|------|---------|----------------|
| Lint | `npm run lint` | Code quality and style rules via ESLint |
| Format | `npm run format` | Code formatting consistency via Prettier |
| Build | `npm run build` | TypeScript compilation |
| Test | `npm test -- --runInBand` | Unit tests via Jest |
| Compat | `npm run test:compat` | Runtime compatibility across Node.js and browser |

## Troubleshooting

### Lint failures

ESLint reports code quality issues. To auto-fix common problems:

```bash
npm run lint -- --fix
```

### Format failures

Prettier enforces consistent code formatting. To auto-fix formatting issues:

```bash
npm run format
```

### Build failures

TypeScript compilation errors. Read the compiler output — it will tell you the exact file, line, and problem.

### Test failures

Jest output shows which tests failed and why. Run a single test file to isolate issues:

```bash
npm test -- path/to/test.ts
```

### Compat failures

Runtime compatibility checks failed. See [Runtime Compatibility](runtime-compatibility.md) for supported environments and guidance.
