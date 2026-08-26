import { Candidate } from '../models/Candidate.js';
import { Workflow } from '../models/Workflow.js';
import { WorkflowLog } from '../models/WorkflowLog.js';
import { Job } from '../models/Job.js';
import { ok } from '../utils/api.js';
export async function analytics(req, res) {
  const jobIds = await Job.find({ createdBy: req.user.id }).distinct('_id');
  const workflowIds = await Workflow.find({ jobId: { $in: jobIds } }).distinct('_id');
  const candidateFilter = { jobId: { $in: jobIds } };
  const workflowFilter = { _id: { $in: workflowIds } };
  const [totalCandidates, shortlisted, totalWorkflows, completed, agentMetrics] = await Promise.all([
    Candidate.countDocuments(candidateFilter), Candidate.countDocuments({ ...candidateFilter, status: { $in: ['shortlisted', 'approved', 'completed'] } }), Workflow.countDocuments(workflowFilter), Workflow.countDocuments({ ...workflowFilter, status: 'completed' }),
    WorkflowLog.aggregate([{ $match: { workflowId: { $in: workflowIds } } }, { $group: { _id: '$agentName', runs: { $sum: 1 }, failures: { $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] } } } }])
  ]);
  return ok(res, { totalCandidates, shortlistRate: totalCandidates ? shortlisted / totalCandidates : 0, workflowCompletionRate: totalWorkflows ? completed / totalWorkflows : 0, agentMetrics });
}
