import { z } from 'zod';
export const signupSchema = z.object({ name: z.string().min(2).max(100), email: z.string().email(), password: z.string().min(8).max(128) });
export const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1) });
export const jobSchema = z.object({ title: z.string().min(2), companyName: z.string().min(2), location: z.string().min(2), employmentType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACTOR', 'TEMPORARY', 'INTERN', 'VOLUNTEER', 'OTHER']).default('FULL_TIME'), description: z.string().min(10), requiredSkills: z.array(z.string()).default([]), preferredSkills: z.array(z.string()).default([]), minExperience: z.coerce.number().min(0).default(0), hiringSpecId: z.string().regex(/^[a-z0-9/_-]+\.json$/i).default('hiring/frontend-developer.json'), workflowSpecId: z.string().regex(/^[a-z0-9/_-]+\.json$/i).default('workflow/default-hiring-workflow.json') });
export const applicationSchema = z.object({ name: z.string().min(2), email: z.string().email(), phone: z.string().max(30).optional(), jobId: z.string().length(24) });
export const workflowIdSchema = z.object({ workflowId: z.string().length(24) });
export const approvalSchema = workflowIdSchema.extend({ approved: z.boolean() });
