import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const jobs = sqliteTable('jobs', {
  id: text('id').primaryKey(),
  ownerId: text('owner_id').notNull(),
  title: text('title').notNull(),
  company: text('company').notNull(),
  location: text('location').notNull(),
  employmentType: text('employment_type').notNull(),
  description: text('description').notNull(),
  skills: text('skills').notNull(),
  scoreThreshold: integer('score_threshold').notNull().default(60),
  published: integer('published', { mode: 'boolean' }).notNull().default(true),
  createdAt: text('created_at').notNull(),
});

export const candidates = sqliteTable('candidates', {
  id: text('id').primaryKey(),
  jobId: text('job_id').notNull().references(() => jobs.id),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  summary: text('summary').notNull(),
  skills: text('skills').notNull(),
  resumeKey: text('resume_key').notNull(),
  score: integer('score').notNull(),
  scoreBreakdown: text('score_breakdown').notNull(),
  status: text('status').notNull(),
  createdAt: text('created_at').notNull(),
});

export const workflowLogs = sqliteTable('workflow_logs', {
  id: text('id').primaryKey(),
  candidateId: text('candidate_id').notNull().references(() => candidates.id),
  step: text('step').notNull(),
  status: text('status').notNull(),
  message: text('message').notNull(),
  createdAt: text('created_at').notNull(),
});
