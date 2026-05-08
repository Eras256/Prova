# Contributing to Prova

Thank you for your interest in contributing to Prova.

## Development Setup

1. Install Node.js 22 LTS and pnpm 9+
2. Clone the repo: `git clone https://github.com/prova-io/prova`
3. Install dependencies: `pnpm install`
4. Copy env files: `cp apps/api/.env.example apps/api/.env`
5. Start dev: `pnpm dev`

## Code Style

- TypeScript strict mode everywhere
- ESLint + Prettier enforced via CI
- No comments unless the WHY is non-obvious
- Tests required for all new features

## Pull Request Process

1. Fork and create a feature branch
2. Ensure `pnpm test` and `pnpm lint` pass
3. Add a changeset: `pnpm changeset`
4. Open PR with description of changes and motivation

## Smart Contract Changes

All changes to `packages/program` require:
- Anchor test coverage for new instructions
- Security review checklist completed
- No breaking changes without deprecation period

## License

By contributing, you agree your contributions are licensed under Apache 2.0.
