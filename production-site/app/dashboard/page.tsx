import Link from 'next/link';
import { createJob } from '@/app/actions';
import { chatGPTSignOutPath, requireChatGPTUser } from '@/app/chatgpt-auth';
import { getRecruiterDashboard } from '@/lib/data';

export default async function Dashboard({ searchParams }: { searchParams: Promise<{ created?: string; error?: string }> }) {
  const user = await requireChatGPTUser('/dashboard');
  const query = await searchParams;
  const data = await getRecruiterDashboard(user.userId);
  const waiting = data.candidates.filter(({ candidate }) => candidate.status === 'waiting_approval').length;
  return <main className="dashboard"><header className="dashboard-nav shell"><Link href="/" className="brand"><span className="brand-mark">A</span><span>AgenticHire</span></Link><div><span>{user.displayName}</span><a href={chatGPTSignOutPath('/')}>Sign out</a></div></header>
    <section className="dashboard-head shell"><div><p className="kicker">Recruiter workspace</p><h1>Hiring, clearly managed.</h1></div><div className="stats"><div><strong>{data.jobs.length}</strong><span>Published roles</span></div><div><strong>{data.candidates.length}</strong><span>Applications</span></div><div><strong>{waiting}</strong><span>Awaiting review</span></div></div></section>
    <section className="dashboard-grid shell"><div className="panel"><div className="panel-head"><div><p className="kicker">Pipeline</p><h2>Candidates</h2></div></div>{data.candidates.length ? <div className="candidate-list">{data.candidates.map(({ candidate, jobTitle }) => <Link href={`/dashboard/candidates/${candidate.id}`} className="candidate-row" key={candidate.id}><div><strong>{candidate.name}</strong><span>{jobTitle}</span></div><div className="score-ring">{candidate.score}</div><span className={`status ${candidate.status}`}>{candidate.status.replace('_',' ')}</span><span>→</span></Link>)}</div> : <p className="panel-empty">Applications will appear here after candidates submit through a published role.</p>}</div>
      <aside className="panel create-panel"><p className="kicker">Publish a vacancy</p><h2>Create a role</h2>{query.created && <p className="alert success">Role published successfully.</p>}{query.error && <p className="alert error">{query.error}</p>}<form action={createJob} className="compact-form"><label>Role title<input name="title" required /></label><label>Company<input name="company" required /></label><div className="form-row"><label>Location<input name="location" required /></label><label>Employment type<select name="employmentType" required><option>Full-time</option><option>Part-time</option><option>Contract</option><option>Internship</option></select></label></div><label>Required skills <span>Comma separated</span><input name="skills" required /></label><label>Shortlisting threshold<input name="scoreThreshold" type="number" min="0" max="100" defaultValue="60" required /></label><label>Description<textarea name="description" minLength={30} rows={6} required /></label><button className="button button-primary full" type="submit">Publish role</button></form></aside>
    </section></main>;
}
