# API design

## Resource model

The API is HTTP/JSON with resource-oriented paths. Actions that are not simple CRUD operations use explicit workflow subcommands (`approve`, `retry`, and `start`). This keeps human-checkpoint semantics obvious to clients.

## Validation

Zod validates request bodies before controllers. Validation transforms numeric form values and supplies safe spec identifiers. Spec paths allow only alphanumeric, slash, underscore, and hyphen characters ending in `.json`; the loader independently enforces that resolved paths stay beneath `specs/`.

## Authentication and authorization

Authentication verifies a bearer JWT. Authorization is ownership-based:

```text
authenticated user → created jobs → candidates/workflows/logs/analytics
```

Public job reads and candidate uploads do not require a token. Management operations always scope through the recruiter’s job IDs. An administrator role exists in the user model but does not bypass tenant isolation in the MVP.

## Response envelope

Every route returns `success` plus either `data` or `error`. This gives frontend code one stable parsing strategy and prevents raw framework/database errors from becoming part of the contract.

## Pagination and filtering

The MVP supports optional candidate filtering by `jobId` but does not yet paginate. Pagination should use cursor-based ordering on `(createdAt, _id)` before high-volume production use. This is listed as a known limitation rather than hidden behind undocumented behavior.

## Idempotency

Read requests are safe. Job updates are idempotent for the same representation. Workflow actions are not yet protected by client-supplied idempotency keys; the UI disables duplicate actions, and state checks constrain execution. Distributed deployment should add atomic transitions and idempotency records.

## Versioning

The current API is unversioned because there is one first-party client. Introduce `/v1` before supporting external consumers or making backwards-incompatible changes.

## Rate limiting

The API applies a process-local limit of 120 requests per minute. A multi-instance deployment should move rate counters to a shared store and apply stricter limits to authentication and public upload routes.
