import { Workflow } from '../models/Workflow.js';
import { WorkflowLog } from '../models/WorkflowLog.js';
import { Job } from '../models/Job.js';
import { Candidate } from '../models/Candidate.js';
import { AppError, ok } from '../utils/api.js';
import { approveWorkflow, retryWorkflow, startWorkflow } from '../services/workflow.service.js';
async function ownedJobIds(userId) { return Job.find({ createdBy: userId }).distinct('_id'); }
async function ownedWorkflow(workflowId, userId) { return Workflow.findOne({ _id: workflowId, jobId: { $in: await ownedJobIds(userId) } }); }
export async function start(req, res) { const candidate = await Candidate.findOne({ _id: req.body.candidateId, jobId: { $in: await ownedJobIds(req.user.id) } }); if (!candidate) throw new AppError(404, 'Candidate not found'); return ok(res, await startWorkflow(candidate._id), 201); }
export async function retry(req, res) { if (!(await ownedWorkflow(req.body.workflowId, req.user.id))) throw new AppError(404, 'Workflow not found'); const value = await retryWorkflow(req.body.workflowId); return ok(res, value); }
export async function approve(req, res) { if (!(await ownedWorkflow(req.body.workflowId, req.user.id))) throw new AppError(404, 'Workflow not found'); const value = await approveWorkflow(req.body.workflowId, req.body.approved); return ok(res, value); }
export async function getWorkflow(req, res) { const workflow = await ownedWorkflow(req.params.id, req.user.id); if (!workflow) throw new AppError(404, 'Workflow not found'); const logs = await WorkflowLog.find({ workflowId: workflow._id }).sort({ createdAt: 1 }).lean(); return ok(res, { workflow, logs }); }
export async function listWorkflows(req, res) { return ok(res, await Workflow.find({ jobId: { $in: await ownedJobIds(req.user.id) } }).populate('candidateId', 'name email status').populate('jobId', 'title').sort({ createdAt: -1 }).lean()); }
