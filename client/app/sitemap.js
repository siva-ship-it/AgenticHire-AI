export default async function sitemap() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/jobs/public`, { next: { revalidate: 300 } }).catch(() => null);
  const jobs = response?.ok ? (await response.json()).data : [];
  return [{ url: appUrl, changeFrequency: 'weekly', priority: 0.8 }, { url: `${appUrl}/jobs`, changeFrequency: 'daily', priority: 1 }, ...jobs.map((job) => ({ url: `${appUrl}/jobs/${job._id}`, lastModified: job.createdAt, changeFrequency: 'weekly', priority: 0.9 }))];
}
