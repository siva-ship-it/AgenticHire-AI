# Security model

## Protected assets

- Recruiter credentials and sessions
- Candidate identity, contact details, and resume content
- Hiring specifications and workflow decisions
- Workflow outputs, errors, and stack traces
- MongoDB, Qdrant, email, and LLM credentials

## Trust boundaries

Public users may list active jobs, view a job, and submit one PDF application. Recruiters may access only data reachable through jobs they created. Infrastructure credentials are server-side environment variables and never use the `NEXT_PUBLIC_` prefix.

## Implemented controls

- bcrypt password hashing with cost factor 12
- JWT signature and expiry verification
- recruiter ownership checks for jobs, candidates, workflows, logs, and analytics
- Zod request validation and path constraints
- Mongo operator sanitization
- Helmet security headers
- request-rate limiting
- explicit CORS allowlist
- PDF MIME filtering, randomized filenames, and 5 MB upload limit
- generic internal-error responses
- production rejection of the development JWT secret
- `.env` and uploaded/logged data excluded from Git
- dependency audit and test jobs in CI

## Secrets

Never place real values in `.env.example`, client-side environment variables, source code, issues, screenshots, or logs. If a secret appears in any of those locations, revoke it; deleting the text is not sufficient because copies and Git history may exist.

Production secret rotation should cover:

- `JWT_SECRET` (rotation invalidates active sessions)
- MongoDB database user password
- Qdrant database API key
- Resend API key
- Groq/OpenRouter keys when those providers are enabled
- deployment tokens and hooks

## Resume handling

PDF MIME validation is not malware detection. A production intake should additionally verify file signatures, scan content, isolate parsing, encrypt storage, restrict operator access, and remove files under a documented retention policy. Do not expose `resumeUrl` as an unauthenticated static route.

## Browser session limitation

The current frontend keeps the bearer token in local storage. This is common for an MVP but increases impact from an XSS vulnerability. Production hardening should move sessions to `HttpOnly`, `Secure`, `SameSite` cookies with appropriate CSRF defenses and refresh-token rotation.

## Logging

Workflow logs intentionally identify candidate/workflow IDs rather than copying full resume text into input fields. Error stacks are stored for recruiter-authorized diagnosis; production retention and redaction should prevent credentials or sensitive provider payloads from entering stack/error fields.

## Reporting vulnerabilities

Follow the private reporting process in the repository-level [SECURITY.md](../SECURITY.md). Do not open a public issue containing exploit details, applicant information, or secrets.
