import path from 'node:path';
import { unlink } from 'node:fs/promises';
import { Candidate } from '../models/Candidate.js';
import { Job } from '../models/Job.js';
import { Workflow } from '../models/Workflow.js';
import { AppError, ok } from '../utils/api.js';
import { startWorkflow } from '../services/workflow.service.js';
export async function uploadCandidate(req, res) {
  if (!req.file) throw new AppError(400, 'A PDF resume is required', 'RESUME_REQUIRED');
  if (!(await Job.exists({ _id: req.body.jobId, isActive: true }))) {
    await unlink(req.file.path).catch(() => {});
    throw new AppError(404, 'Active job not found');
  }
  const candidate = await Candidate.create({ ...req.body, resumeUrl: path.resolve(req.file.path) });
  const workflow = await startWorkflow(candidate._id); return ok(res, { candidate, workflow }, 201);
}
export async function listCandidates(req, res) {
  const jobIds = await Job.find({ createdBy: req.user.id }).distinct('_id');
  const query = { jobId: req.query.jobId && jobIds.some((id) => id.equals(req.query.jobId)) ? req.query.jobId : { $in: jobIds } };
  return ok(res, await Candidate.find(query).populate('jobId', 'title').sort({ createdAt: -1 }).lean());
}
export async function getCandidate(req, res) {
  const candidate = await Candidate.findById(req.params.id).populate('jobId');
  if (!candidate || !candidate.jobId?.createdBy?.equals(req.user.id)) throw new AppError(404, 'Candidate not found');
  const workflow = await Workflow.findOne({ candidateId: candidate._id }).lean(); return ok(res, { candidate, workflow });
}
