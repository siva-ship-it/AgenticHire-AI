# Deployment runbook

## Recommended topology

| Component | Service | Repository root |
|---|---|---|
| Next.js client | Vercel | `client` |
| Express API | Render | `server` |
| Application database | MongoDB Atlas | Managed |
| Vector database | Qdrant Cloud | Managed |
| Email | Resend | Managed |
| Resume storage | Render persistent disk initially | `UPLOAD_DIR` |

## Prerequisites

- GitHub repository containing `main`
- MongoDB Atlas cluster/user/connection string
- Qdrant Cloud cluster URL and database API key
- Resend API key and verified sender domain for real delivery
- Vercel and Render accounts connected to GitHub

Rotate any credential that has appeared in a committed file, screenshot, chat, terminal recording, or public issue.

## 1. Provision MongoDB Atlas

1. Create a cluster and database user.
2. Configure the network access required by the API host.
3. Copy the application connection string and select an `agentichire` database.
4. Keep the URI only in Render secrets.

Example shape:

```text
mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/agentichire?retryWrites=true&w=majority
```

Reference: <https://www.mongodb.com/docs/atlas/driver-connection/>

## 2. Provision Qdrant Cloud

1. Create a cluster near the API region.
2. Create a database API key with write access and an expiration/rotation plan.
3. Record the HTTPS cluster endpoint and key once.

Reference: <https://qdrant.tech/documentation/cloud-quickstart/>

## 3. Deploy the API to Render

Use `render.yaml` as a Blueprint or create a Web Service manually:

```text
Root directory: server
Build command: npm ci
Start command: npm start
Health check: /health
```

Set:

```env
NODE_ENV=production
CLIENT_URL=https://YOUR_VERCEL_DOMAIN
MONGODB_URI=YOUR_ATLAS_URI
JWT_SECRET=UNIQUE_RANDOM_SECRET
QDRANT_URL=https://YOUR_QDRANT_CLUSTER:6333
QDRANT_API_KEY=YOUR_QDRANT_DATABASE_KEY
RESEND_API_KEY=YOUR_RESEND_KEY
EMAIL_FROM=Recruiting <jobs@YOUR_VERIFIED_DOMAIN>
UPLOAD_DIR=/opt/render/project/src/server/uploads
```

The blueprint declares a persistent resume disk. Render persistent disks require a compatible paid service and disable zero-downtime deploys; use private object storage when moving beyond a single API instance.

Reference: <https://render.com/docs/deploy-node-express-app>

## 4. Deploy the client to Vercel

Import the GitHub repository and set the Vercel Root Directory to `client`.

Set Production and Preview environment values:

```env
NEXT_PUBLIC_API_URL=https://YOUR_RENDER_API
NEXT_PUBLIC_APP_URL=https://YOUR_VERCEL_DOMAIN
```

Deploy, then update `CLIENT_URL` on Render with the exact Vercel/custom origin and redeploy the API. Multiple explicit origins can be comma-separated.

Reference: <https://vercel.com/docs/monorepos>

## 5. Configure Resend

Verify a domain/subdomain with the SPF and DKIM records shown by Resend. Change `EMAIL_FROM` only after the sender is verified. Without a key the server simulates delivery, which is useful locally but not a production notification.

Reference: <https://resend.com/docs/dashboard/domains/introduction>

## 6. Configure GitHub CD

Add Actions secrets:

| Secret | Used for |
|---|---|
| `RENDER_DEPLOY_HOOK_URL` | API deployment after CI |
| `VERCEL_TOKEN` | Vercel CLI authentication |
| `VERCEL_ORG_ID` | Vercel account/team |
| `VERCEL_PROJECT_ID` | Linked client project |

The CD workflow is optional until all required secrets exist. Render/Vercel native Git integration may be used instead; disable duplicate automatic deployment if GitHub Actions owns CD.

## 7. Production smoke test

1. `GET https://YOUR_API/health` returns status `ok`.
2. `/jobs` loads without CORS or mixed-content errors.
3. Recruiter signup/login succeeds.
4. A job appears publicly with the correct company/location.
5. A PDF application reaches `waiting_approval`.
6. The workflow graph and logs are owner-visible.
7. Approval/rejection resumes the correct branch.
8. Email is delivered from the verified sender.
9. A second recruiter cannot read the first recruiter’s data.
10. `robots.txt` and `sitemap.xml` contain the production domain.

## Rollback

- Vercel: promote a known-good deployment or revert the Git commit.
- Render: deploy a known-good commit from the Events page.
- Database: avoid destructive schema migrations; snapshot before changes.
- Specs: revert the spec commit together with code expecting that spec version.
