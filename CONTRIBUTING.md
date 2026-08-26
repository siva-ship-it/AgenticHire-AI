# Contributing

## Development setup

Follow the README quick start, then create a branch from `main`:

```bash
git switch -c feat/short-description
```

## Repository rules

- Use JavaScript only; do not add TypeScript.
- Keep frontend code in `client/`, backend code in `server/`, and business rules in `specs/`.
- Do not hardcode thresholds, prompt text, workflow order, retry behavior, or evaluation weights.
- Validate every API input and return the standard JSON envelope.
- Public apply routes must remain unauthenticated; recruiter data must remain owner-scoped.
- Never commit real `.env` files, candidate resumes, logs, API keys, or applicant data.

## Commit style

Use focused Conventional Commit messages:

```text
feat: add public careers directory
fix: scope workflow approval to job owner
test: cover invalid resume uploads
docs: document deployment topology
ci: verify client and server images
```

Keep refactors separate from behavior changes when possible.

## Before opening a pull request

```bash
npm test
npm run build
docker compose config
```

Update specs, tests, OpenAPI, and technical documentation when behavior changes. Complete the pull-request checklist and reference the relevant issue.
