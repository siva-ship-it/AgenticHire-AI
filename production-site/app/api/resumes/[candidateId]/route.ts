import { env } from 'cloudflare:workers';
import { and, eq } from 'drizzle-orm';
import { getDb } from '@/db';
import { candidates, jobs } from '@/db/schema';
import { getChatGPTUser } from '@/app/chatgpt-auth';

export async function GET(_: Request, { params }: { params: Promise<{ candidateId: string }> }) {
  const user = await getChatGPTUser();
  if (!user) return new Response('Unauthorized', { status: 401 });
  const { candidateId } = await params;
  const rows = await getDb().select({ candidate: candidates }).from(candidates).innerJoin(jobs, eq(candidates.jobId, jobs.id)).where(and(eq(candidates.id, candidateId), eq(jobs.ownerId, user.userId))).limit(1);
  if (!rows[0]) return new Response('Not found', { status: 404 });
  const object = await env.FILES.get(rows[0].candidate.resumeKey);
  if (!object) return new Response('Not found', { status: 404 });
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('content-disposition', `attachment; filename="${rows[0].candidate.name.replace(/[^a-zA-Z0-9_-]/g,'_')}-resume.pdf"`);
  return new Response(object.body, { headers });
}
