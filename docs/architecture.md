# Architecture

## Architectural goals

AgenticHire is designed around five constraints:

1. Business decisions come from versioned JSON specifications.
2. Candidate processing is asynchronous in shape, persisted, retryable, and observable.
3. Public candidate routes and recruiter-only operations have separate trust boundaries.
4. Every automated recommendation pauses for an accountable human decision.
5. External services are replaceable behind small service/agent modules.

## System context

```mermaid
flowchart TB
    subgraph People
        Recruiter[Recruiter]
        Candidate[Candidate]
    end

    subgraph AgenticHire
        Client[Next.js web application]
        API[Express REST API]
        Workflow[LangGraph workflow service]
        Agents[Specialized agents]
        Specs[JSON specs]
    end

    Mongo[(MongoDB)]
    Qdrant[(Qdrant)]
    Resend[Resend]

    Recruiter -->|JWT-authenticated dashboard| Client
    Candidate -->|Public job and apply routes| Client
    Client -->|HTTPS JSON / multipart| API
    API --> Mongo
    API --> Workflow
    Workflow --> Agents
    Workflow --> Specs
    Agents --> Qdrant
    Agents --> Resend
```

## Backend component model

```mermaid
flowchart LR
    Routes[Routes] --> Validation[Zod validation]
    Validation --> Controllers[Controllers]
    Controllers --> Services[Domain services]
    Services --> Models[Mongoose models]
    Services --> Workflow[Workflow service]
    Workflow --> LangGraph[LangGraph node execution]
    LangGraph --> Parser[Resume parser]
    LangGraph --> Embed[Embedding agent]
    LangGraph --> Match[Matching agent]
    LangGraph --> Shortlist[Shortlisting agent]
    LangGraph --> Interview[Interview agent]
    LangGraph --> Email[Email agent]
    Parser --> Specs[Spec loader]
    Match --> Specs
    Shortlist --> Specs
    Workflow --> Logs[Workflow logs]
```

The Express application is a modular monolith. A single deployable API owns request validation, authorization, workflow persistence, and agent execution. Modules are separated by responsibility so high-volume steps can later move to workers without redesigning the HTTP contract.

## Candidate workflow

```mermaid
sequenceDiagram
    actor C as Candidate
    participant W as Next.js
    participant A as Express API
    participant M as MongoDB
    participant G as LangGraph
    participant Q as Qdrant
    actor R as Recruiter
    participant E as Resend

    C->>W: Submit details + PDF
    W->>A: POST /candidates/upload
    A->>M: Create candidate + workflow
    A->>G: Start configured workflow
    G->>G: Parse resume
    G->>Q: Store resume chunks
    G->>G: Match against hiring spec
    G->>G: Apply evaluation spec
    G->>M: Persist waiting_approval
    A-->>W: Candidate + workflow receipt
    R->>W: Inspect workflow graph
    W->>A: POST /workflow/approve
    A->>G: Resume checkpoint
    alt approved
        G->>G: Generate interview package
        G->>E: Send interview email
    else rejected
        G->>E: Send rejection email
    end
    G->>M: Persist completed state and logs
```

## State and persistence

MongoDB is the source of truth for users, jobs, candidates, workflows, and execution logs. Workflow state is written before and after each agent node. The saved context contains only JSON-serializable results required to resume later; Mongoose documents and file handles are not persisted inside graph context.

Qdrant is a derived retrieval store. Resume chunks can be regenerated from the original uploaded file while that file remains available. A Qdrant outage is classified by the retry spec and recorded in workflow logs.

## Specification boundary

```mermaid
flowchart TD
    Hiring[hiring/*.json] --> Match[Matching behavior]
    Evaluation[evaluation/*.json] --> Score[Weights and decisions]
    WorkflowSpec[workflow/*.json] --> Order[Node order]
    Retry[system/retry-policy.json] --> Recovery[Retry count and delay]
    RAG[system/rag.json] --> Retrieval[Chunking and search]
    Prompts[prompts/*.json] --> LLM[Deterministic prompt settings]
    EmailSpec[email/*.json] --> Messages[Email templates]
```

Adding a role or changing a threshold should change a spec, not a controller. Specs are cached per process; a production spec-management feature would add validation, versioning, and cache invalidation.

## Security boundaries

- Candidate job discovery and application submission are public.
- Recruiter jobs, candidate records, workflows, approvals, logs, and analytics require a signed JWT.
- Recruiter queries are scoped through the `createdBy` relationship on jobs.
- Passwords are hashed with bcrypt and never returned by default.
- Inputs are Zod-validated, Mongo operators are sanitized, uploads are PDF-only and size-limited, and HTTP headers/rates are hardened.
- Browser origins are allowlisted using `CLIENT_URL`.
- Secrets are environment variables and ignored by Git.

See [Security](security.md) for the threat model and operational requirements.

## Deployment topology

### Live managed topology

```mermaid
flowchart LR
    Candidate[Candidate browser] --> Site[AgenticHire Sites application]
    Recruiter[Recruiter with ChatGPT auth] --> Site
    Site --> D1[(Cloudflare D1)]
    Site --> R2[(Private Cloudflare R2)]
    Site --> Score[Deterministic skill matching]
    Score --> Approval{Human approval}
    GitHub[GitHub source] --> CI[GitHub Actions]
    CI --> Site
```

The managed edition in `production-site/` is the active hosted application. It combines public careers pages and recruiter routes in one deployable unit. D1 stores jobs, candidates, and workflow logs; R2 stores PDF resumes privately; recruiter access uses ChatGPT authentication. Tenant-scoped queries and the human approval checkpoint remain enforced in application code.

### Reference service topology

```mermaid
flowchart LR
    Internet((Internet)) --> Vercel[Vercel: client]
    Internet --> Render[Render: server]
    Vercel -->|NEXT_PUBLIC_API_URL| Render
    Render --> Atlas[(MongoDB Atlas)]
    Render --> QCloud[(Qdrant Cloud)]
    Render --> REmail[Resend]
    Render --> Disk[(Persistent resume disk)]
    GitHub[GitHub] -->|CD| Vercel
    GitHub -->|CD| Render
```

The client and server deploy independently from the same repository. Production resume handling needs a private persistent disk or object store. The deployment runbook records every environment mapping and smoke test.

## Scaling path

The first scaling boundary is workflow execution. Upload requests currently run agent nodes until the approval checkpoint. At higher volume, the controller should enqueue a workflow ID and return `202 Accepted`; one or more workers should then execute nodes with idempotency keys and distributed locking. MongoDB remains the state store, and the API contract does not need to change materially.
