'use server';

import { env } from 'cloudflare:workers';
import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getDb } from '@/db';
import { candidates, jobs, workflowLogs } from '@/db/schema';
import { requireChatGPTUser } from './chatgpt-auth';
import { scoreCandidate, splitSkills } from '@/lib/scoring';

const now = () => new Date().toISOString();
const text = (form: FormData, key: string) => String(form.get(key) ?? '').trim();

export async function createJob(form: FormData) {
  const user = await requireChatGPTUser('/dashboard');
  const title = text(form, 'title');
  const company = text(form, 'company');
  const location = text(form, 'location');
  const employmentType = text(form, 'employmentType');
  const description = text(form, 'description');
  const skills = splitSkills(text(form, 'skills'));
  const threshold = Number(text(form, 'scoreThreshold'));
  if (!title || !company || !location || !employmentType || description.length < 30 || !skills.length || !Number.isFinite(threshold) || threshold < 0 || threshold > 100) {
    redirect('/dashboard?error=Please+complete+every+job+field');
  }
  await getDb().insert(jobs).values({ id: crypto.randomUUID(), ownerId: user.userId, title, company, location, employmentType, description, skills: JSON.stringify(skills), scoreThreshold: Math.round(threshold), published: true, createdAt: now() });
  revalidatePath('/');
  revalidatePath('/dashboard');
  redirect('/dashboard?created=1');
}

export async function submitApplication(jobId: string, form: FormData) {
  const db = getDb();
  const jobRows = await db.select().from(jobs).where(and(eq(jobs.id, jobId), eq(jobs.published, true))).limit(1);
  const job = jobRows[0];
  if (!job) redirect('/?error=Role+not+available');
  const name = text(form, 'name');
  const email = text(form, 'email').toLowerCase();
  const phone = text(form, 'phone');
  const summary = text(form, 'summary');
  const candidateSkills = splitSkills(text(form, 'skills'));
  const resume = form.get('resume');
  if (!name || !email.includes('@') || !phone || summary.length < 80 || !candidateSkills.length || !(resume instanceof File) || resume.size === 0) {
    redirect(`/jobs/${jobId}/apply?error=Please+complete+all+fields`);
  }
  if (resume.size > 5 * 1024 * 1024 || (!resume.name.toLowerCase().endsWith('.pdf') && resume.type !== 'application/pdf')) {
    redirect(`/jobs/${jobId}/apply?error=Resume+must+be+a+PDF+under+5MB`);
  }
  const id = crypto.randomUUID();
  const resumeKey = `resumes/${jobId}/${id}.pdf`;
  await env.FILES.put(resumeKey, await resume.arrayBuffer(), { httpMetadata: { contentType: 'application/pdf', contentDisposition: `attachment; filename="${resume.name.replace(/[^a-zA-Z0-9._-]/g, '_')}"` } });
  const result = scoreCandidate(JSON.parse(job.skills), candidateSkills, summary);
  const status = result.score >= job.scoreThreshold ? 'waiting_approval' : 'not_selected';
  const createdAt = now();
  await db.insert(candidates).values({ id, jobId, name, email, phone, summary, skills: JSON.stringify(candidateSkills), resumeKey, score: result.score, scoreBreakdown: JSON.stringify(result), status, createdAt });
  const steps = [
    ['application_received', 'completed', 'Application details validated'],
    ['resume_stored', 'completed', 'PDF stored in private object storage'],
    ['profile_evaluated', 'completed', `Deterministic skill match scored ${result.score}%`],
    status === 'waiting_approval' ? ['human_review', 'waiting', 'Recruiter decision required'] : ['threshold_gate', 'completed', 'Application did not meet the configured threshold'],
  ];
  for (const [step, stepStatus, message] of steps) await db.insert(workflowLogs).values({ id: crypto.randomUUID(), candidateId: id, step, status: stepStatus, message, createdAt: now() });
  revalidatePath('/dashboard');
  redirect(`/jobs/${jobId}/apply?submitted=1`);
}

export async function decideCandidate(candidateId: string, decision: 'approved' | 'rejected') {
  const user = await requireChatGPTUser(`/dashboard/candidates/${candidateId}`);
  const rows = await getDb().select({ candidate: candidates }).from(candidates).innerJoin(jobs, eq(candidates.jobId, jobs.id)).where(and(eq(candidates.id, candidateId), eq(jobs.ownerId, user.userId))).limit(1);
  if (!rows[0] || !['approved', 'rejected'].includes(decision)) redirect('/dashboard?error=Candidate+not+found');
  await getDb().update(candidates).set({ status: decision }).where(eq(candidates.id, candidateId));
  await getDb().insert(workflowLogs).values({ id: crypto.randomUUID(), candidateId, step: 'human_review', status: 'completed', message: decision === 'approved' ? 'Recruiter approved candidate for interview' : 'Recruiter rejected candidate', createdAt: now() });
  revalidatePath('/dashboard');
  revalidatePath(`/dashboard/candidates/${candidateId}`);
  redirect(`/dashboard/candidates/${candidateId}?decision=${decision}`);
}
