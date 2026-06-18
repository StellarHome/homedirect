# Contributing to HomeDirect

First off — thank you. HomeDirect exists to fix a real problem for millions of people across Africa, and every contribution moves that mission forward.

This document covers everything you need to know to go from zero to your first merged PR.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How the project is organised](#how-the-project-is-organised)
- [Ways to contribute](#ways-to-contribute)
- [Your first contribution](#your-first-contribution)
- [Development setup](#development-setup)
- [Branch & commit conventions](#branch--commit-conventions)
- [Pull request process](#pull-request-process)
- [Smart contract contributions](#smart-contract-contributions)
- [Frontend contributions](#frontend-contributions)
- [Relayer contributions](#relayer-contributions)
- [Writing tests](#writing-tests)
- [Reporting bugs](#reporting-bugs)
- [Suggesting features](#suggesting-features)
- [Maintainer notes](#maintainer-notes)

---

## Code of Conduct

We follow the [Contributor Covenant](https://www.contributor-covenant.org/version/2/1/code_of_conduct/). In short:

- Be respectful and patient with everyone
- Criticism is about code, never about people
- Harassment of any kind will result in an immediate ban

Report violations to the maintainer privately via GitHub.

---

## How the project is organised

```
homedirect/
├── frontend/          Next.js 14 web app (TypeScript + Tailwind)
├── contracts/         Soroban smart contracts (Rust)
├── relayer/           Node.js backend / Stellar relayer (TypeScript)
└── .github/           Issue templates, CI workflows
```

The project maintainer reviews and merges all PRs. Large changes should be discussed in an issue first before you invest time coding.

---

## Ways to contribute

You do not need to write code to contribute meaningfully:

| Contribution type | Where to start |
|---|---|
| 🐛 Bug report | [Open a bug issue](.github/ISSUE_TEMPLATE/bug_report.md) |
| ✨ Feature request | [Open a feature issue](.github/ISSUE_TEMPLATE/feature_request.md) |
| 🦀 Smart contract work | See [Smart contract contributions](#smart-contract-contributions) |
| 🎨 UI / UX improvement | Pick a `frontend` labelled issue |
| 📖 Documentation | Fix typos, improve README, add inline code comments |
| 🌍 Localisation | Help adapt copy for other African markets |
| 🧪 Writing tests | Frontend, relayer, or contract unit tests |
| 🔍 Code review | Comment on open PRs — fresh eyes are always valuable |

---

## Your first contribution

1. Look for issues labelled [`good first issue`](https://github.com/homedirect-africa/homedirect/labels/good%20first%20issue)
2. Comment on the issue to let maintainers know you are working on it
3. Fork the repo and create your branch (see conventions below)
4. Make your changes, write or update tests where relevant
5. Open a pull request — fill in the PR template fully

If you are not sure where to start, open a Discussion and ask. No question is too basic.

---

## Development setup

### Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Node.js | ≥ 18 | [nodejs.org](https://nodejs.org) |
| npm | ≥ 9 | bundled with Node |
| Rust | stable | `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs \| sh` |
| Stellar CLI | latest | `cargo install stellar-cli --locked` |

### Clone and install

```bash
git clone https://github.com/homedirect-africa/homedirect.git
cd homedirect

# Frontend
cd frontend && npm install && cd ..

# Relayer
cd relayer && npm install && cd ..
```

### Environment files

```bash
# Frontend
cp frontend/.env.example frontend/.env.local

# Relayer
cp relayer/.env.example relayer/.env
```

Fill in the Stellar testnet keys. You can generate a testnet keypair with:

```bash
stellar keys generate --global test-key --network testnet
stellar keys address test-key
```

Fund your testnet account automatically via [Stellar Friendbot](https://friendbot.stellar.org).

### Run everything locally

```bash
# Terminal 1 — frontend
cd frontend && npm run dev

# Terminal 2 — relayer
cd relayer && npm run dev

# Terminal 3 — build & deploy contracts to testnet
cd contracts/homedirect_lease
stellar contract build
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/homedirect_lease.wasm \
  --source test-key \
  --network testnet
```

---

## Branch & commit conventions

### Branch names

```
feat/short-description        # new feature
fix/short-description         # bug fix
chore/short-description       # tooling, deps, config
docs/short-description        # documentation only
contract/short-description    # smart contract changes
test/short-description        # tests only
```

Examples:
```
feat/listing-search-filters
fix/escrow-release-edge-case
contract/add-dispute-timeout
docs/update-stellar-setup
```

### Commit messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short summary>

[optional body]

[optional footer]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `contract`

Scopes: `frontend`, `relayer`, `contracts`, `ci`, `readme`

Examples:
```
feat(frontend): add transparency strip to listing card
fix(contracts): correct service fee calculation in create_lease
docs(readme): add Stellar testnet setup instructions
contract(lease): add dispute timeout after 30 ledgers
```

**Keep the summary line under 72 characters. Use imperative mood: "add" not "added".**

---

## Pull request process

1. **Open an issue first** for anything larger than a typo fix or small bug. This prevents wasted effort if the direction does not align.

2. **Fill in the PR template fully.** Incomplete PRs will be asked to update before review begins.

3. **Keep PRs small and focused.** One logical change per PR. Split large features into a series of smaller PRs if possible.

4. **All CI checks must pass** before a PR can be merged:
   - ESLint (frontend + relayer)
   - TypeScript compilation
   - Contract build (`cargo build`)
   - Unit tests

5. **At least one approval** from the maintainer is required to merge.

6. **Do not force-push** to a PR branch after review has started — it makes re-review harder.

7. The maintainer will squash-merge PRs to keep the main branch history clean.

### PR description template

When you open a PR, you will see a template. Please complete all sections:

- **What this PR does** — a one-paragraph summary
- **Related issue** — link the issue this closes (`Closes #123`)
- **Type of change** — bug fix / feature / docs / contract / refactor
- **How to test** — steps a reviewer can follow to verify the change
- **Screenshots** — for any UI changes, before and after screenshots are required
- **Checklist** — confirm you have run linting, tests, and updated docs if needed

---

## Smart contract contributions

Soroban contracts live in `contracts/`. Each contract is an independent Rust crate.

### Building

```bash
cd contracts/homedirect_lease
stellar contract build
```

### Testing

```bash
cargo test
```

Write tests in `src/test.rs` using the Soroban test utilities:

```rust
#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::testutils::{Address as _, AuthorizedFunction, AuthorizedInvocation};
    use soroban_sdk::{token, Address, Env, IntoVal};

    #[test]
    fn test_create_lease() {
        let env = Env::default();
        // ... your test
    }
}
```

### Contract change rules

- **Never modify a deployed contract's storage layout** without a migration plan
- All new contract entry points must be documented in the function's doc comment
- Any change that affects funds handling requires two maintainer approvals
- Include a short security rationale in the PR description for any auth or transfer change

---

## Frontend contributions

The frontend is a Next.js 14 app using the App Router, TypeScript, and Tailwind CSS.

### Design tokens

All colours, spacing, and typography come from the design system defined in:
- `tailwind.config.ts` — Tailwind token extensions
- `app/globals.css` — CSS custom properties

Do not introduce arbitrary hex values or hardcoded spacing. Use tokens.

### Component rules

- Components go in `app/components/` organised by domain (`ui/`, `layout/`, `listings/`, `wallet/`)
- All components are typed — no `any`
- Client components that use hooks or browser APIs must have `"use client"` at the top
- Server components are the default — keep data-fetching at the server component level where possible

### Styling rules

- Use Tailwind utility classes as the primary styling method
- The `transparency-strip` and `card-lift` CSS classes are part of the brand identity — do not modify without discussing in an issue first
- Mobile-first: all new UI must work on 375px screens before being extended for desktop

---

## Relayer contributions

The relayer is a Node.js + Express API in TypeScript that bridges the frontend with Stellar.

### Adding a new route

1. Create your route file in `relayer/src/routes/your-route.ts`
2. Register it in `relayer/src/index.ts` under `/api/v1/your-route`
3. Add input validation — never trust request body fields
4. Handle errors with try/catch and return typed error responses

### Stellar SDK usage

All Stellar SDK calls are centralised in `relayer/src/services/stellar.ts`. Add new contract interactions there, not inline in route handlers.

### Security rules

- Never log secret keys, even in development
- Validate all input before passing to the Stellar SDK
- Use environment variables for all credentials — no hardcoded values anywhere

---

## Writing tests

### Frontend

```bash
cd frontend
npm test           # run Jest tests
npm run test:watch # watch mode
```

Tests live alongside components: `Button.test.tsx` next to `Button.tsx`.

### Relayer

```bash
cd relayer
npm test
```

Use `supertest` for route testing and mock the `StellarService` in unit tests.

### Contracts

```bash
cd contracts/homedirect_lease
cargo test
```

---

## Reporting bugs

Use the [Bug Report issue template](.github/ISSUE_TEMPLATE/bug_report.md).

A good bug report includes:
- What you expected to happen
- What actually happened
- Steps to reproduce (numbered, specific)
- Your environment (OS, Node version, browser, network — testnet or mainnet)
- Any relevant logs or screenshots

**Security vulnerabilities** should NOT be reported in public issues. Email the maintainer directly or use GitHub's private security advisory feature.

---

## Suggesting features

Use the [Feature Request issue template](.github/ISSUE_TEMPLATE/feature_request.md).

Before opening a feature request:
- Search existing issues to see if it has been suggested already
- Consider whether it fits the project's scope (Nigeria → Africa rental marketplace)
- Think about who else would benefit from this feature

---

## Maintainer notes

The project maintainer will:

- Triage new issues within 5 business days
- Review PRs within 7 business days
- Tag issues with appropriate labels (`bug`, `feature`, `good first issue`, `contract`, `frontend`, `relayer`, `help wanted`)
- Maintain the project roadmap in the GitHub Projects board
- Publish release notes for each tagged version

If a PR sits without review for more than 7 days, please comment on it to ping the maintainer.

---

Thank you for helping build something that matters. 🌍