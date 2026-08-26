import { sendCandidateEmail } from '../services/email.service.js';
export async function emailAgent({ candidate, job }) { return { success: true, data: await sendCandidateEmail({ candidate, job, kind: candidate.status === 'rejected' ? 'rejection' : 'interview' }) }; }
