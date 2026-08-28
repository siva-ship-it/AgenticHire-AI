import Link from 'next/link';
import { getPublishedJobs } from '@/lib/data';

export default async function Home() {
  const roles = await getPublishedJobs();
  return (
    <main>
      <nav className="nav shell">
        <Link href="/" className="brand" aria-label="AgenticHire home"><span className="brand-mark">A</span><span>AgenticHire</span></Link>
        <div className="nav-links"><a href="#roles">Open roles</a><Link className="button button-secondary" href="/dashboard">Recruiter workspace</Link></div>
      </nav>
      <section className="hero shell">
        <div className="eyebrow"><span /> Spec-driven hiring</div>
        <h1>Great hiring decisions deserve a visible process.</h1>
        <p className="hero-copy">Discover open roles, apply securely, and follow a structured process where people—not opaque automation—make the final decision.</p>
        <div className="hero-actions"><a className="button button-primary" href="#roles">Explore roles</a><Link className="text-link" href="/dashboard">Manage hiring <span>→</span></Link></div>
        <div className="trust-row" aria-label="Hiring principles"><span>Human approval</span><span>Structured evaluation</span><span>Private documents</span></div>
      </section>
      <section className="roles-section" id="roles"><div className="shell">
        <div className="section-heading"><div><p className="kicker">Careers</p><h2>Open roles</h2></div><p>Every vacancy includes clear expectations and a direct, secure application path.</p></div>
        {roles.length ? <div className="role-grid">{roles.map((role) => {
          const skills = JSON.parse(role.skills) as string[];
          return <article className="role-card" key={role.id}>
            <div className="role-meta"><span>{role.employmentType}</span><span>{role.location}</span></div><h3>{role.title}</h3>
            <p className="company-name">{role.company}</p><div className="skill-list">{skills.slice(0,4).map((skill) => <span key={skill}>{skill}</span>)}</div>
            <Link href={`/jobs/${role.id}`} className="card-link">View role <span>↗</span></Link>
          </article>;
        })}</div> : <div className="empty-state"><span className="empty-icon">○</span><h3>No published roles yet</h3><p>Recruiters can sign in to create the first real vacancy. Demonstration listings are never used to collect candidate data.</p><Link className="button button-primary" href="/dashboard">Open recruiter workspace</Link></div>}
      </div></section>
      <footer className="shell footer"><span>© 2026 AgenticHire</span><span>Responsible recruitment technology</span></footer>
    </main>
  );
}
