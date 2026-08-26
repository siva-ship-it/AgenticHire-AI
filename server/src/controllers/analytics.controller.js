import { Candidate } from '../models/Candidate.js';
import { Workflow } from '../models/Workflow.js';
import { WorkflowLog } from '../models/WorkflowLog.js';
import { ok } from '../utils/api.js';
export async function analytics(_req, res) {
  const [totalCandidates, shortlisted, totalWorkflows, completed, agentMetrics] = await Promise.all([
    Candidate.countDocuments(), Candidate.countDocuments({ status: { $in: ['shortlisted', 'approved', 'completed'] } }), Workflow.countDocuments(), Workflow.countDocuments({ status: 'completed' }),
    WorkflowLog.aggregate([{ $group: { _id: '$agentName', runs: { $sum: 1 }, failures: { $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] } } } }])
  ]);
  return ok(res, { totalCandidates, shortlistRate: totalCandidates ? shortlisted / totalCandidates : 0, workflowCompletionRate: totalWorkflows ? completed / totalWorkflows : 0, agentMetrics });
}
