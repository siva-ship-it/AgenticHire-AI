import { Resend } from 'resend';
import { env } from '../config/env.js';
import { loadSpec } from '../utils/spec-loader.js';

const interpolate = (text, values) => text.replace(/{{(\w+)}}/g, (_, key) => values[key] ?? '');
export async function sendCandidateEmail({ candidate, job, kind }) {
  const templates = await loadSpec('email/templates.json');
  const template = templates[kind];
  const values = { candidateName: candidate.name, jobTitle: job.title };
  if (!env.RESEND_API_KEY) return { simulated: true, to: candidate.email, subject: interpolate(template.subject, values) };
  const resend = new Resend(env.RESEND_API_KEY);
  return resend.emails.send({ from: env.EMAIL_FROM, to: candidate.email, subject: interpolate(template.subject, values), text: interpolate(template.body, values) });
}
