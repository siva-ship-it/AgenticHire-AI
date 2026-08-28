import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPublishedJob } from '@/lib/data';

export default async function JobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = await getPublishedJob(id);
  if (!job) notFound();
  const skills = JSON.parse(job.skills) as string[];
  return <main><nav className="nav shell"><Link href="/" className="brand"><span className="brand-mark">A</span><span>AgenticHire</span></Link><Link href="/">All roles</Link></nav>
    <section className="detail-hero shell"><p className="kicker">{job.company}</p><h1>{job.title}</h1><div className="role-meta large"><span>{job.employmentType}</span><span>{job.location}</span></div></section>
    <section className="detail-layout shell"><article className="prose-card"><h2>About the role</h2>{job.description.split('\n').filter(Boolean).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}<h2>What we look for</h2><div className="skill-pills">{skills.map((skill) => <span key={skill}>{skill}</span>)}</div></article>
      <aside className="apply-card"><p className="kicker">Interested?</p><h3>Bring your experience.</h3><p>Applications are evaluated against the published role criteria, then reviewed by a person.</p><Link className="button button-primary full" href={`/jobs/${job.id}/apply`}>Apply for this role</Link><small>PDF resume · Maximum 5MB</small></aside></section>
  </main>;
}
