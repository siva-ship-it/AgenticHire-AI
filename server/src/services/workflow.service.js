import { Workflow } from '../models/Workflow.js';
import { WorkflowLog } from '../models/WorkflowLog.js';
import { Candidate } from '../models/Candidate.js';
import { Job } from '../models/Job.js';
import { loadSpec } from '../utils/spec-loader.js';
import { resumeParserAgent } from '../agents/resume-parser.js';
import { embeddingAgent } from '../agents/embedding-agent.js';
import { matchingAgent } from '../agents/matching-agent.js';
import { shortlistingAgent } from '../agents/shortlisting-agent.js';
import { interviewAgent } from '../agents/interview-agent.js';
import { emailAgent } from '../agents/email-agent.js';
import { Annotation, END, START, StateGraph } from '@langchain/langgraph';

const agents = { resume_parser: resumeParserAgent, embedding_agent: embeddingAgent, matching_agent: matchingAgent, shortlisting_agent: shortlistingAgent, interview_agent: interviewAgent, email_agent: emailAgent };
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function invokeAgentGraph(agent, context) {
  const AgentState = Annotation.Root({ context: Annotation(), output: Annotation() });
  const graph = new StateGraph(AgentState)
    .addNode('agent', async (state) => ({ output: await agent(state.context) }))
    .addEdge(START, 'agent')
    .addEdge('agent', END)
    .compile();
  return (await graph.invoke({ context })).output;
}

async function executeStep(workflow, step, context) {
  const retry = await loadSpec('system/retry-policy.json');
  step.status = 'running'; step.startedAt = new Date(); workflow.currentState = step.name; await workflow.save();
  for (let attempt = 0; attempt <= retry.max_retries; attempt += 1) {
    try {
      const output = await invokeAgentGraph(agents[step.name], context);
      Object.assign(context, step.name === 'resume_parser' ? { parsedResume: output.data } : step.name === 'matching_agent' ? { match: output.data } : step.name === 'shortlisting_agent' ? { shortlist: output.data } : { [step.name]: output.data });
      step.status = 'success'; step.completedAt = new Date();
      await WorkflowLog.create({ workflowId: workflow._id, agentName: step.name, input: { candidateId: context.candidate._id }, output, status: 'success' });
      await workflow.save(); return;
    } catch (error) {
      step.retries = attempt;
      const canRetry = retry.retryable_errors.includes(error.code) && attempt < retry.max_retries;
      await WorkflowLog.create({ workflowId: workflow._id, agentName: step.name, status: canRetry ? 'retrying' : 'failed', error: error.message, stack: error.stack });
      if (!canRetry) { step.status = 'failed'; step.error = error.message; throw error; }
      await sleep(retry.retry_delay_ms);
    }
  }
}

export async function startWorkflow(candidateId) {
  const candidate = await Candidate.findById(candidateId); const job = await Job.findById(candidate.jobId);
  const workflowSpec = await loadSpec(job.workflowSpecId); const hiringSpec = await loadSpec(job.hiringSpecId);
  const workflow = await Workflow.create({ candidateId, jobId: job._id, steps: workflowSpec.workflow.map((name) => ({ name, status: 'pending' })), currentState: workflowSpec.workflow[0], context: {} });
  candidate.status = 'processing'; await candidate.save();
  await continueWorkflow(workflow, { candidate, job, hiringSpec, filePath: candidate.resumeUrl });
  return workflow;
}

export async function continueWorkflow(workflow, supplied = {}) {
  const candidate = supplied.candidate || await Candidate.findById(workflow.candidateId); const job = supplied.job || await Job.findById(workflow.jobId);
  const saved = workflow.context || {};
  const context = { ...saved, candidate, job, hiringSpec: supplied.hiringSpec || await loadSpec(job.hiringSpecId), filePath: supplied.filePath || candidate.resumeUrl };
  try {
    for (const step of workflow.steps) {
      if (step.status === 'success' || step.status === 'skipped') continue;
      if (step.name === 'human_approval') {
        step.status = 'waiting_approval'; workflow.status = 'waiting_approval'; workflow.currentState = step.name;
        workflow.context = { parsedResume: context.parsedResume, match: context.match, shortlist: context.shortlist };
        candidate.status = 'waiting_approval'; await Promise.all([workflow.save(), candidate.save()]); return workflow;
      }
      await executeStep(workflow, step, context);
      if (context.parsedResume) candidate.parsedResumeJson = context.parsedResume;
      if (context.match) candidate.matchScore = context.match.match_score;
      if (context.shortlist) candidate.status = context.shortlist.status;
      workflow.context = { parsedResume: context.parsedResume, match: context.match, shortlist: context.shortlist, interview_agent: context.interview_agent };
      await Promise.all([workflow.save(), candidate.save()]);
    }
    workflow.status = 'completed'; candidate.status = 'completed'; await Promise.all([workflow.save(), candidate.save()]); return workflow;
  } catch (error) { workflow.status = 'failed'; candidate.status = 'failed'; await Promise.all([workflow.save(), candidate.save()]); return workflow; }
}

export async function approveWorkflow(workflowId, approved) {
  const workflow = await Workflow.findById(workflowId); if (!workflow) return null;
  const candidate = await Candidate.findById(workflow.candidateId); const step = workflow.steps.find((x) => x.name === 'human_approval');
  step.status = 'success'; step.completedAt = new Date(); candidate.status = approved ? 'approved' : 'rejected';
  if (!approved) { workflow.steps.filter((x) => x.status === 'pending' && x.name !== 'email_agent').forEach((x) => { x.status = 'skipped'; }); }
  workflow.status = 'running'; await Promise.all([workflow.save(), candidate.save()]); return continueWorkflow(workflow, { candidate });
}

export async function retryWorkflow(workflowId) {
  const workflow = await Workflow.findById(workflowId); if (!workflow) return null;
  const failed = workflow.steps.find((x) => x.status === 'failed'); if (failed) { failed.status = 'pending'; failed.error = undefined; }
  workflow.status = 'running'; await workflow.save(); return continueWorkflow(workflow);
}
