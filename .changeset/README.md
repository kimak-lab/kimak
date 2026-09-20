# Changesets

Kimak versions and publishes `@kimak/*` packages with [Changesets](https://github.com/changesets/changesets).

```bash
pnpm changeset
```

Merging to `main` opens a Version Packages PR. Merging that PR publishes to npm via `.github/workflows/release.yml`.
