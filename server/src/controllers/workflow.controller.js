import { Workflow } from '../models/Workflow.js';
import { WorkflowLog } from '../models/WorkflowLog.js';
import { AppError, ok } from '../utils/api.js';
import { approveWorkflow, retryWorkflow, startWorkflow } from '../services/workflow.service.js';
export async function start(req, res) { return ok(res, await startWorkflow(req.body.candidateId), 201); }
export async function retry(req, res) { const value = await retryWorkflow(req.body.workflowId); if (!value) throw new AppError(404, 'Workflow not found'); return ok(res, value); }
export async function approve(req, res) { const value = await approveWorkflow(req.body.workflowId, req.body.approved); if (!value) throw new AppError(404, 'Workflow not found'); return ok(res, value); }
export async function getWorkflow(req, res) { const workflow = await Workflow.findById(req.params.id).lean(); if (!workflow) throw new AppError(404, 'Workflow not found'); const logs = await WorkflowLog.find({ workflowId: workflow._id }).sort({ createdAt: 1 }).lean(); return ok(res, { workflow, logs }); }
export async function listWorkflows(_req, res) { return ok(res, await Workflow.find().populate('candidateId', 'name email status').populate('jobId', 'title').sort({ createdAt: -1 }).lean()); }
