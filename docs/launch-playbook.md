# GitHub and LinkedIn launch playbook

## GitHub repository profile

Recommended repository name:

```text
AgenticHire-AI
```

Recommended description:

```text
Spec-driven AI recruitment platform with public applications, LangGraph workflows, RAG, human approval, and visual execution monitoring.
```

Recommended topics:

```text
ai-recruitment  applicant-tracking-system  langgraph  rag  nextjs  express  mongodb  qdrant  multi-agent  workflow-automation
```

Repository setup after the first push:

1. Make the repository public only when you are comfortable exposing its source and history.
2. Add the description, topics, and deployed frontend URL.
3. Enable Issues and Discussions if you want public feedback.
4. Configure private vulnerability reporting and update `SECURITY.md` with the chosen contact.
5. Add the Actions deployment secrets described in the deployment runbook.
6. Protect `main`: require the CI workflow and prevent force pushes.
7. Create issues from the prioritized items in `docs/roadmap.md`.

## Portfolio launch post

Adapt this copy rather than claiming capabilities that are still listed as limitations:

> I built AgenticHire AI, a spec-driven recruitment workflow platform—not a chatbot.
>
> Recruiters can publish roles, receive public PDF applications, inspect persisted AI workflow execution, review deterministic candidate matching, and approve or reject at a human checkpoint. The platform includes a Next.js recruiter workspace, Express API, MongoDB state, Qdrant retrieval, LangGraph orchestration, React Flow visualization, tests, Docker images, OpenAPI documentation, and CI/CD.
>
> The main engineering idea is that hiring thresholds, scoring weights, workflow order, retries, prompts, and email templates live in versioned specs instead of being hardcoded.
>
> Live demo: [FRONTEND_URL]
> GitHub and architecture: [REPOSITORY_URL]
>
> I would value feedback on workflow observability, human-in-the-loop design, and responsible recruitment automation.

Suggested tags:

```text
#SoftwareEngineering #ArtificialIntelligence #NextJS #NodeJS #LangGraph #RAG #OpenSource #RecruitmentTechnology
```

## Publishing an actual vacancy on LinkedIn

1. Create the role in the deployed recruiter dashboard.
2. Verify it appears at `https://YOUR_DOMAIN/jobs`.
3. Copy the exact application URL: `https://YOUR_DOMAIN/jobs/JOB_ID/apply`.
4. Create a LinkedIn Job Post using the real employer, employment type, location, responsibilities, qualifications, and compensation information required by your organization/location.
5. Choose the option to direct applicants to an external site and paste the exact application URL—not only the careers home page.
6. Test the link in a private/incognito browser without recruiter authentication.
7. Submit a synthetic resume and verify the entire workflow before advertising it.

## Candidate acquisition channels

- LinkedIn job listing with External Apply
- LinkedIn company/personal post linking to the specific role
- Organization website navigation linking to `/jobs`
- Direct outreach and employee referrals using role-specific URLs
- University/community boards for appropriate internships or junior roles
- Search engines through the sitemap and JobPosting metadata already included

Do not publish fake roles merely to demonstrate the software. For a portfolio demo, label the role and data as demonstration content and do not collect real applicant resumes.

## Launch-day checklist

- [ ] Repository visibility intentionally selected
- [ ] CI green on GitHub
- [ ] No `.env`, resume, log, or secret tracked
- [ ] MongoDB Atlas and Qdrant access restricted and rotated
- [ ] Production domain and CORS origins exact
- [ ] Persistent/private resume storage active
- [ ] Resend sender verified
- [ ] Privacy notice, consent, retention, and deletion process published
- [ ] Public `/jobs`, `robots.txt`, and `sitemap.xml` verified
- [ ] Signup, job creation, application, approval/rejection, and email smoke-tested
- [ ] Second-recruiter tenant isolation smoke-tested
- [ ] Monitoring and rollback owner identified
