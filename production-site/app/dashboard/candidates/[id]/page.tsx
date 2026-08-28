import Link from 'next/link';
import { notFound } from 'next/navigation';
import { decideCandidate } from '@/app/actions';
import { requireChatGPTUser } from '@/app/chatgpt-auth';
import { getRecruiterCandidate } from '@/lib/data';

export default async function CandidatePage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ decision?: string }> }) {
  const { id } = await params;
  const query = await searchParams;
  const user = await requireChatGPTUser(`/dashboard/candidates/${id}`);
  const data = await getRecruiterCandidate(user.userId, id);
  if (!data) notFound();
  const breakdown = JSON.parse(data.candidate.scoreBreakdown) as { matched: string[]; missing: string[] };
  const approve = decideCandidate.bind(null, id, 'approved');
  const reject = decideCandidate.bind(null, id, 'rejected');
  return <main className="dashboard"><header className="dashboard-nav shell"><Link href="/dashboard">← Dashboard</Link><Link href="/" className="brand"><span className="brand-mark">A</span><span>AgenticHire</span></Link></header>
    <section className="candidate-hero shell"><div><p className="kicker">{data.job.title}</p><h1>{data.candidate.name}</h1><p>{data.candidate.email} · {data.candidate.phone}</p></div><div className="big-score"><strong>{data.candidate.score}</strong><span>Match score</span></div></section>
    <section className="candidate-layout shell"><article className="panel candidate-profile">{query.decision && <p className="alert success">Decision recorded: {query.decision}.</p>}<h2>Candidate profile</h2><p>{data.candidate.summary}</p><h3>Matched criteria</h3><div className="skill-pills good">{breakdown.matched.map((skill) => <span key={skill}>{skill}</span>)}{!breakdown.matched.length && <span>None</span>}</div><h3>Missing criteria</h3><div className="skill-pills missing">{breakdown.missing.map((skill) => <span key={skill}>{skill}</span>)}{!breakdown.missing.length && <span>None</span>}</div><a className="button button-secondary" href={`/api/resumes/${id}`}>Download private resume</a></article>
      <aside className="panel"><p className="kicker">Execution log</p><h2>Workflow</h2><ol className="workflow-list">{data.logs.map((log) => <li key={log.id} className={log.status}><span /><div><strong>{log.step.replaceAll('_',' ')}</strong><p>{log.message}</p></div></li>)}</ol>{data.candidate.status === 'waiting_approval' ? <div className="decision-box"><p>A person must make the final decision.</p><div><form action={approve}><button className="button button-primary" type="submit">Approve</button></form><form action={reject}><button className="button button-danger" type="submit">Reject</button></form></div></div> : <p className={`status large ${data.candidate.status}`}>Current status: {data.candidate.status.replace('_',' ')}</p>}</aside></section>
  </main>;
}
