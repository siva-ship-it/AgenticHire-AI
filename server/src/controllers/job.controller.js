import { Job } from '../models/Job.js';
import { AppError, ok } from '../utils/api.js';
import { loadSpec } from '../utils/spec-loader.js';
export async function createJob(req, res) { await loadSpec(req.body.hiringSpecId); await loadSpec(req.body.workflowSpecId); return ok(res, await Job.create({ ...req.body, createdBy: req.user.id }), 201); }
export async function listPublicJobs(_req, res) { return ok(res, await Job.find({ isActive: true }).select('title companyName location employmentType description requiredSkills preferredSkills minExperience createdAt').sort({ createdAt: -1 }).lean()); }
export async function listJobs(req, res) { return ok(res, await Job.find({ createdBy: req.user.id }).sort({ createdAt: -1 }).lean()); }
export async function getJob(req, res) { const job = await Job.findById(req.params.id).lean(); if (!job) throw new AppError(404, 'Job not found'); return ok(res, job); }
export async function updateJob(req, res) { const job = await Job.findOneAndUpdate({ _id: req.params.id, createdBy: req.user.id }, req.body, { new: true, runValidators: true }); if (!job) throw new AppError(404, 'Job not found'); return ok(res, job); }
