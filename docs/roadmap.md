# Engineering roadmap

These backlog items are ready to become GitHub issues after the repository has a remote. Priorities reflect risk and product value rather than implementation novelty.

## P0: real-applicant readiness

### Private object storage and deletion lifecycle

- Store resumes in encrypted private object storage.
- Scan uploads before parsing.
- Record consent/privacy-policy version.
- Delete MongoDB, workflow logs, vectors, and files as one audited operation.
- Add retention automation and recruiter controls.

### Secure cookie sessions

- Move access tokens out of local storage.
- Add short-lived access and rotating refresh sessions.
- Implement CSRF protection and logout revocation.
- Add password reset and email verification.

### Durable background workflows

- Return `202` after application persistence.
- Queue workflow IDs for worker execution.
- Add idempotency keys, atomic transitions, and distributed locks.
- Recover in-progress workflows after worker termination.

## P1: product completeness

### Candidate detail workspace

- Show parsed evidence, score breakdown, missing skills, logs, and recruiter notes.
- Provide status filters, search, pagination, and CSV export.

### Job lifecycle

- Add edit, preview, close, reopen, and archive controls.
- Remove closed jobs from public discovery without deleting history.

### Provider-backed intelligence

- Replace development hash embeddings with BAAI/bge-small-en-v1.5.
- Add schema-validated Groq output with OpenRouter fallback.
- Preserve deterministic score authority and display sourced explanations.

### Interview scheduling and email lifecycle

- Add calendar integration, scheduling state, reminders, and delivery webhooks.
- Track bounce/complaint events and suppress failed addresses.

## P2: scale and governance

- Organization/team membership and role administration
- Spec versioning, validation UI, approval history, and migration tooling
- Shared-store rate limiting and structured observability
- Browser E2E suite with disposable infrastructure
- Accessibility audit, performance budgets, and localization
