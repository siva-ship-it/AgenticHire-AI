import Link from 'next/link';

export const metadata = { title: 'Open roles', description: 'Browse current opportunities and apply directly through AgenticHire AI.' };

async function getJobs() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/jobs/public`, { next: { revalidate: 300 } }).catch(() => null);
  if (!response) return [];
  if (!response.ok) return [];
  return (await response.json()).data;
}

export default async function CareersPage() {
  const jobs = await getJobs();
  return <main className="min-h-screen"><nav className="max-w-6xl mx-auto p-6 font-black">AgenticHire <span className="text-green-700">AI</span></nav><section className="max-w-6xl mx-auto px-6 py-16"><p className="text-xs uppercase tracking-[.2em] font-bold text-green-700">Careers</p><h1 className="text-5xl font-black mt-4">Do work that moves hiring forward.</h1><p className="text-gray-600 text-lg mt-5 max-w-2xl">Explore our current openings. Every application is reviewed against a transparent hiring specification with a human decision-maker in control.</p><div className="grid md:grid-cols-2 gap-5 mt-12">{jobs.map((job) => <article key={job._id} className="card p-6"><h2 className="text-xl font-bold">{job.title}</h2><p className="text-sm text-gray-500 mt-3 line-clamp-3">{job.description}</p><div className="flex flex-wrap gap-2 mt-5">{job.requiredSkills.slice(0, 5).map((skill) => <span className="badge" key={skill}>{skill}</span>)}</div><Link className="btn btn-primary mt-6 text-sm" href={`/jobs/${job._id}`}>View role</Link></article>)}{!jobs.length && <div className="card p-8 text-gray-500">There are no open roles right now. Please check back soon.</div>}</div></section></main>;
}
