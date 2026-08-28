# AgenticHire Sites production application

This directory contains the deployable production edition of AgenticHire. It preserves the product behavior of the reference implementation while using managed hosting capabilities:

- ChatGPT authentication for recruiter-only routes
- Cloudflare D1 and Drizzle for tenant-scoped roles, candidates, and workflow logs
- private R2 object storage for PDF resumes
- deterministic, explainable skill matching
- human approval or rejection before interview progression
- public vacancy and application pages

## Local development

```bash
npm install
npm run db:generate
npm run dev
```

The hosting control plane provisions the real D1 database, R2 bucket, and recruiter authentication. Do not add credentials to `.openai/hosting.json` or commit local environment files.

## Responsible use

The match score is a transparent comparison of recruiter-published skills with candidate-provided skills and experience text. It must not be treated as an employment decision. A recruiter remains responsible for every approval and for complying with applicable privacy, discrimination, retention, accessibility, and employment laws.
