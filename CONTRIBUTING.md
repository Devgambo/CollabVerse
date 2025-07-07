# Contributing Guide

Welcome! We’re using a **Fork + Pull Request** model to manage contributions for this project. This workflow helps reduce merge conflicts and ensures clean, reviewed code changes.

---

## Table of Contents

- [For Fork-Based Contributors](#for-fork-based-contributors)
- [For All Contributors](#for-all-contributors)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Branch Naming Convention](#branch-naming-convention)
- [Code Style](#code-style)

---

## For Fork-Based Contributors

### Step 1: Fork the Repository

Click the **Fork** button on the top-right of [this repo](https://github.com/adithya-adee/hackverse).

### Step 2: Clone Your Fork Locally

```bash
git clone https://github.com/<your-username>/CodeSync.git
cd codeSync
# Verify remotes
git remote add upstream https://github.com/Devgambo/CodeSync.git
``` 

### Step 3: Create a Branch and Work

```bash
git checkout -b feat/your-feature-name
# Follow branch naming convention
# Make your changes
git add .
git commit -m "feat: add feature description"
git push origin feat/your-feature-name
```

### Step 4: Sync Your Fork with Upstream

Before creating a PR, make sure your feature branch is built on the latest `main` from the upstream repo:

```bash
# 1. Fetch all branches from upstream
git fetch upstream
# 2. Switch to your local main branch
git checkout main
# 3. Merge the latest changes from upstream/main
git merge upstream/main
# Fix any conflicts, then
# 4. Push the updated main to your fork
git push origin main
# 5. Rebase (or merge) your feature branch onto the updated main
git checkout feat/your-feature-name
git rebase main # or: git merge main
```

<details>
<summary>Alternative: Or Use GitHub UI</summary>

1. On your fork on GitHub, click the **Fetch upstream** button (above the file list).
2. Click **Fetch and merge** to sync your fork’s `main` with the original repo.
3. Pull the updated `main` locally:
   ```bash
   git pull origin main
   ```
4. Rebase or merge your feature branch onto the refreshed `main` as shown above.
</details>

### Step 5: Open a Pull Request

1. Go to your fork → switch to your feature branch → click **Compare & pull request**.
2. Base repository: `Devgambo/codeSync` → Base branch: `main`.

---

## For All Contributors

1. Always work on a **separate branch** (never directly on `main`).
2. Keep your branch focused on a **single change or feature**.
3. Regularly **sync with the main repo** to avoid conflicts.
4. **Open a pull request** from your branch into `main`.
5. One of us will review and merge it once approved.

---

## Pull Request Guidelines

- Provide a clear **title** and **description**.
- Link related issues if any (`Closes #issue-id`).
- Ensure your branch is up-to-date with `main`.
- Use [Conventional Commits](https://www.conventionalcommits.org/):

  ```
  feat: add user login feature
  fix: resolve layout overflow in dashboard
  refactor: optimize database queries
  ```

---

## Branch Naming Convention

| Type     | Prefix      | Example                    |
| -------- | ----------- | -------------------------- |
| Feature  | `feat/`     | `feat/user-authentication` |
| Bug Fix  | `fix/`      | `fix/login-validation`     |
| Refactor | `refactor/` | `refactor/db-queries`      |
| Docs     | `docs/`     | `docs/contributing-guide`  |

---

## Code Style

- Use Prettier & ESLint if available.
- Follow consistent indentation and naming.
- Write self-documenting code.
- Include comments for complex logic.
- Test before committing.
- Follow SOLID principles.
