import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPublishedJob } from '@/lib/data';
import { submitApplication } from '@/app/actions';

export default async function ApplyPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ submitted?: string; error?: string }> }) {
  const { id } = await params;
  const query = await searchParams;
  const job = await getPublishedJob(id);
  if (!job) notFound();
  if (query.submitted) return <main className="center-page"><section className="success-card"><div className="success-mark">✓</div><p className="kicker">Application received</p><h1>Thank you for applying.</h1><p>Your information was securely received for <strong>{job.title}</strong>. The recruiting team will contact you if there is a next step.</p><Link className="button button-primary" href="/">Return to open roles</Link></section></main>;
  const action = submitApplication.bind(null, job.id);
  return <main><nav className="nav shell"><Link href="/" className="brand"><span className="brand-mark">A</span><span>AgenticHire</span></Link><Link href={`/jobs/${job.id}`}>Back to role</Link></nav>
    <section className="form-shell shell"><div className="form-intro"><p className="kicker">Application</p><h1>{job.title}</h1><p>{job.company} · {job.location}</p><div className="privacy-note"><strong>Your data stays private.</strong><span>The resume is stored in private object storage and is only available to the role owner.</span></div></div>
      <form action={action} className="form-card">{query.error && <p className="alert error">{query.error}</p>}<label>Full name<input name="name" required autoComplete="name" /></label><label>Email address<input name="email" type="email" required autoComplete="email" /></label><label>Phone number<input name="phone" required autoComplete="tel" /></label><label>Skills <span>Comma separated</span><input name="skills" required placeholder="Node.js, AWS, PostgreSQL" /></label><label>Experience summary <span>Minimum 80 characters</span><textarea name="summary" required minLength={80} rows={7} placeholder="Describe experience relevant to this role..." /></label><label>Resume <span>PDF, maximum 5MB</span><input name="resume" required type="file" accept="application/pdf,.pdf" /></label><label className="consent"><input name="consent" type="checkbox" required /><span>I consent to this information being used to assess my application.</span></label><button className="button button-primary full" type="submit">Submit application</button></form>
    </section></main>;
}
