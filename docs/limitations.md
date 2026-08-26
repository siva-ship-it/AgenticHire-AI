# Known limitations

Transparent limitations make the project more credible and provide a practical roadmap.

## Production blockers

1. **File storage:** local `UPLOAD_DIR` requires a persistent private disk. Object storage, malware scanning, encryption, lifecycle deletion, and signed access are not implemented.
2. **Session storage:** browser JWTs use local storage; production should prefer secure HTTP-only cookies and refresh rotation.
3. **Privacy operations:** there is no candidate self-service deletion, retention scheduler, consent-version record, or data export.
4. **Background execution:** workflows run inside the API process until the approval checkpoint. High-volume use needs a durable queue, workers, idempotency, and distributed locking.
5. **Rate limiting:** counters are process-local and should move to a shared store for multiple API replicas.

## AI and retrieval limitations

- Resume extraction is deterministic PDF text parsing with vocabulary/regex extraction; scanned-image OCR is not supported.
- Development embeddings are deterministic hashed vectors with the configured dimension, not the final BAAI model named by the original spec.
- Matching and shortlisting are intentionally deterministic. Groq/OpenRouter prompt specs exist, but a production LLM explanation/provider layer is not yet active.
- Qdrant retrieval falls back to an empty context on search errors; storage failures remain retryable workflow failures.
- Interview output is deterministic and should be expanded with spec-constrained provider output plus schema validation.

## Product limitations

- No password reset, email verification, invitation, organization, or recruiter team management.
- No edit/close UI for jobs, even though the update API exists.
- No candidate detail screen, notes, manual stage movement, bulk action, or export.
- No pagination or full-text recruiter search.
- No interview scheduling/calendar integration.
- Email reminders and delivery webhooks are not implemented.
- The administrator role has no special management interface.

## Operations limitations

- MongoDB multi-document operations do not use transactions.
- Workflow specs are process-cached and have no live reload/version migration.
- Metrics are computed from operational collections rather than a dedicated reporting pipeline.
- GitHub CD requires repository secrets and hosted service accounts supplied by the owner.
- A project license has not been selected; the repository owner should choose one before inviting external contributions.
