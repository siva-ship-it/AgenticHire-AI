import { and, desc, eq } from 'drizzle-orm';
import { getDb } from '@/db';
import { candidates, jobs, workflowLogs } from '@/db/schema';

export async function getPublishedJobs() {
  return getDb().select().from(jobs).where(eq(jobs.published, true)).orderBy(desc(jobs.createdAt));
}

export async function getPublishedJob(id: string) {
  const rows = await getDb().select().from(jobs).where(and(eq(jobs.id, id), eq(jobs.published, true))).limit(1);
  return rows[0] ?? null;
}

export async function getRecruiterDashboard(ownerId: string) {
  const recruiterJobs = await getDb().select().from(jobs).where(eq(jobs.ownerId, ownerId)).orderBy(desc(jobs.createdAt));
  const recruiterCandidates = await getDb()
    .select({ candidate: candidates, jobTitle: jobs.title })
    .from(candidates)
    .innerJoin(jobs, eq(candidates.jobId, jobs.id))
    .where(eq(jobs.ownerId, ownerId))
    .orderBy(desc(candidates.createdAt));
  return { jobs: recruiterJobs, candidates: recruiterCandidates };
}

export async function getRecruiterCandidate(ownerId: string, candidateId: string) {
  const rows = await getDb()
    .select({ candidate: candidates, job: jobs })
    .from(candidates)
    .innerJoin(jobs, eq(candidates.jobId, jobs.id))
    .where(and(eq(candidates.id, candidateId), eq(jobs.ownerId, ownerId)))
    .limit(1);
  if (!rows[0]) return null;
  const logs = await getDb().select().from(workflowLogs).where(eq(workflowLogs.candidateId, candidateId)).orderBy(workflowLogs.createdAt);
  return { ...rows[0], logs };
}
