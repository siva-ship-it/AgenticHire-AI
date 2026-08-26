# AgenticHire AI

A spec-driven recruitment platform with a Next.js recruiter workspace, public candidate applications, an Express API, persisted multi-step AI workflows, MongoDB, Qdrant-backed retrieval, and human approval checkpoints.

## Prerequisites

- Node.js 20+
- MongoDB and Qdrant (use Docker Compose below)

## Start locally

1. Copy `server/.env.example` to `server/.env` and `client/.env.local.example` to `client/.env.local`.
2. Replace `JWT_SECRET` and optionally add Resend credentials. Without a Resend key, email delivery is safely simulated.
3. Start infrastructure: `docker compose up -d`.
4. Install dependencies: `npm install`, then `npm run install:all`.
5. Run both applications: `npm run dev`.

The recruiter application is at `http://localhost:3000`; the API is at `http://localhost:5000`.

## End-to-end flow

Create an account, create a job, open its public apply link, and upload a text-based PDF resume. The upload automatically starts the configured workflow. Return to **Workflows** to inspect the graph and approve or reject the human checkpoint.

All thresholds, weights, workflow steps, retries, RAG settings, prompts, and email templates live in `specs/`. Application code consumes those files; business decisions are not embedded in routes or UI code.

## Tests

Run backend tests with `npm test --prefix server`, or all project checks with `npm test`.

## Project structure

- `client/`: Next.js App Router frontend (JavaScript)
- `server/`: modular Express backend, agents, workflow runner, persistence, uploads, and logs
- `specs/`: runtime business and workflow specifications
- `docker-compose.yml`: MongoDB and Qdrant development services
