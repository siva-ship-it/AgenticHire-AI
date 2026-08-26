# Design decisions

This document records decisions that materially shape the system. It prevents future contributors from accidentally replacing deliberate boundaries with convenient shortcuts.

## ADR-001: Business rules are runtime specifications

**Status:** Accepted

Thresholds, scoring weights, workflow order, retry policy, RAG settings, prompts, and email templates live in `specs/`.

**Why:** Hiring policy changes more often than infrastructure. Versioned specs make policy reviewable and testable without editing controller code.

**Trade-off:** JSON files do not provide an administrative editing UI, approval history, or dynamic cache invalidation yet.

## ADR-002: Modular Express monolith

**Status:** Accepted

The backend deploys as one Node.js process with routes, controllers, services, models, agents, and workflow modules.

**Why:** The MVP benefits from simple local development and atomic MongoDB state changes. Clear module boundaries preserve an extraction path for workers/services later.

**Trade-off:** Long-running workflow work currently consumes API process capacity.

## ADR-003: MongoDB is the workflow source of truth

**Status:** Accepted

Candidate and workflow state are persisted before and after agent nodes. Qdrant is a derived retrieval store, not the authoritative candidate record.

**Why:** Recruiter screens need flexible, document-shaped state and append-only execution records. Mongoose supplies schema validation and references while matching the mandated stack.

**Trade-off:** Cross-document state changes are not wrapped in transactions in the MVP.

## ADR-004: Human approval is a durable checkpoint

**Status:** Accepted

Automation stops at `human_approval`, persists `waiting_approval`, and resumes only through an authenticated owner action.

**Why:** Candidate disposition must remain accountable and inspectable. A hidden automatic decision would undermine the product’s main trust model.

## ADR-005: Deterministic scoring precedes generative output

**Status:** Accepted

Match score and shortlist status are calculated from normalized skills, experience, spec weights, and decision bands. Generative output is not allowed to silently change the numeric decision.

**Why:** Deterministic scoring is reproducible and easy to test. LLMs can enrich explanations/interview material without becoming an unreviewable policy engine.

## ADR-006: Public candidate boundary, private recruiter boundary

**Status:** Accepted

Active job reads and applications are public. All management data is scoped through the authenticated recruiter’s owned jobs.

**Why:** Candidates must apply without an account, while one recruiter must never observe another recruiter’s candidate information.

## ADR-007: Hosted client and API deploy independently

**Status:** Accepted

`client/` is suitable for Vercel and `server/` for a long-running Node host such as Render. CORS and public API URLs are environment configuration.

**Why:** Next.js CDN/SSR behavior and Express/worker requirements scale differently.

**Trade-off:** Deploy order and cross-origin configuration require an explicit runbook.

## ADR-008: Resume files require persistent private storage

**Status:** Accepted for MVP, replacement recommended

The backend writes resumes to `UPLOAD_DIR`. Local development uses `server/uploads`; a hosted service must mount persistent private storage.

**Why:** This preserves the spec’s required folder and keeps parsing simple.

**Trade-off:** Local disks constrain horizontal scaling. Object storage with encryption, signed access, malware scanning, and lifecycle policies is the preferred production evolution.
