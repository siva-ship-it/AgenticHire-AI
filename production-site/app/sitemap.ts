import type { MetadataRoute } from 'next';
import { getPublishedJobs } from '@/lib/data';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> { const origin = 'https://agentichire-ai.sampath6068.chatgpt.site'; const jobs = await getPublishedJobs(); return [{ url: origin, changeFrequency: 'daily', priority: 1 }, ...jobs.map((job) => ({ url: `${origin}/jobs/${job.id}`, lastModified: job.createdAt, changeFrequency: 'weekly' as const, priority: .8 }))]; }
