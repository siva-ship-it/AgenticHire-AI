# Managed production runbook

## Live application

- Production URL: <https://agentichire-ai.sampath6068.chatgpt.site>
- Source directory: `production-site/`
- Hosting: OpenAI Sites on Cloudflare Workers
- Database: Cloudflare D1 with Drizzle migrations
- Files: private Cloudflare R2 bucket
- Recruiter identity: ChatGPT authentication

The site is initially owner-only. Change the Sites access policy to public only when the owner is ready for candidates to use the application.

## Candidate journey

1. A recruiter signs in and publishes a role from `/dashboard`.
2. The role appears on the public home page and receives a stable `/jobs/{id}` URL.
3. The candidate opens `/jobs/{id}/apply`, provides consent, and submits a PDF resume.
4. The application stores the resume privately in R2 and the candidate record in D1.
5. Transparent skill matching records matched and missing skills plus a score.
6. Candidates meeting the role threshold wait for an explicit recruiter decision.
7. The candidate timeline records submission, scoring, and approval or rejection.

## Release checks

Run from the repository root:

```powershell
npm.cmd ci --prefix production-site
npm.cmd run lint --prefix production-site
npm.cmd run build --prefix production-site
npm.cmd audit --omit=dev --audit-level=high --prefix production-site
```

GitHub Actions repeats these checks on pushes and pull requests. A Sites release must be built, packaged from the successful build, saved as a version tied to the pushed commit, and then deployed.

## Data and security

- Candidate forms accept PDFs up to 5 MB.
- Resume objects are not public; downloads require recruiter authentication and tenant ownership.
- Job, candidate, and workflow queries are scoped to the authenticated recruiter.
- Matching is deterministic and explainable; it does not make a final employment decision.
- No secret belongs in `.openai/hosting.json`, Git, browser code, or documentation.

Before accepting real applications, publish an organization-specific privacy notice, define retention and deletion procedures, and confirm legal and accessibility requirements. Notification delivery and calendar scheduling are not included in the managed edition yet; decisions remain visible in the recruiter workflow.

## Rollback

Redeploy a previously saved Sites version. Database migrations should remain forward-compatible; do not delete candidate records or resume objects as part of a code rollback.
