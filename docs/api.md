# API reference

Base URLs:

- Local: `http://localhost:5000`
- Hosted: the Render/custom API domain configured through `NEXT_PUBLIC_API_URL`

The machine-readable contract is [`openapi.yaml`](openapi.yaml).

## Conventions

Successful response:

```json
{
  "success": true,
  "data": {}
}
```

Error response:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email must be valid"
  }
}
```

Authenticated endpoints require:

```http
Authorization: Bearer <jwt>
```

JSON requests use `Content-Type: application/json`. Candidate applications use `multipart/form-data`.

## Endpoint summary

| Method | Path | Access | Purpose |
|---|---|---|---|
| GET | `/health` | Public | Liveness check |
| POST | `/auth/signup` | Public | Create recruiter account |
| POST | `/auth/login` | Public | Obtain JWT |
| GET | `/auth/me` | Recruiter | Current identity |
| GET | `/jobs/public` | Public | Active careers directory |
| GET | `/jobs/:id` | Public | Public job detail |
| POST | `/jobs` | Recruiter | Create owned job |
| GET | `/jobs` | Recruiter | List owned jobs |
| PUT | `/jobs/:id` | Owner | Update owned job |
| POST | `/candidates/upload` | Public | Apply with PDF and start workflow |
| GET | `/candidates` | Recruiter | List candidates for owned jobs |
| GET | `/candidates/:id` | Owner | Candidate plus workflow |
| GET | `/workflow` | Recruiter | List workflows for owned jobs |
| POST | `/workflow/start` | Owner | Start candidate workflow manually |
| POST | `/workflow/retry` | Owner | Retry failed workflow |
| POST | `/workflow/approve` | Owner | Resolve human checkpoint |
| GET | `/workflow/:id` | Owner | Workflow and ordered logs |
| GET | `/analytics` | Recruiter | Metrics for owned jobs |

## Examples

### Sign up

```bash
curl -X POST http://localhost:5000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Recruiter","email":"recruiter@example.com","password":"strong-password"}'
```

### Create a job

```bash
curl -X POST http://localhost:5000/jobs \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title":"Frontend Developer",
    "companyName":"Example Ltd",
    "location":"London, UK",
    "employmentType":"FULL_TIME",
    "description":"Build accessible recruitment experiences.",
    "requiredSkills":["React","JavaScript","CSS"],
    "preferredSkills":["Next.js","Tailwind CSS"],
    "minExperience":2,
    "hiringSpecId":"hiring/frontend-developer.json",
    "workflowSpecId":"workflow/default-hiring-workflow.json"
  }'
```

### Apply publicly

```bash
curl -X POST http://localhost:5000/candidates/upload \
  -F "name=Jordan Candidate" \
  -F "email=jordan@example.com" \
  -F "phone=+44 0000 000000" \
  -F "jobId=507f1f77bcf86cd799439011" \
  -F "resume=@resume.pdf;type=application/pdf"
```

The upload accepts one PDF up to 5 MB. A successful request creates the candidate and automatically executes the configured workflow until the human checkpoint or a terminal failure.

### Approve a workflow

```bash
curl -X POST http://localhost:5000/workflow/approve \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"workflowId":"507f1f77bcf86cd799439012","approved":true}'
```

## Status and error semantics

| Status | Meaning |
|---:|---|
| 200 | Successful read/update/action |
| 201 | Resource created |
| 400 | Schema, upload type, or upload size error |
| 401 | Missing/invalid/expired token |
| 403 | Browser origin denied |
| 404 | Resource absent or not owned by authenticated recruiter |
| 409 | Email already registered |
| 429 | Rate limit exceeded |
| 500 | Unexpected internal failure; detail is not exposed |

Authorization intentionally returns `404` for another recruiter’s resource to avoid revealing its existence.
