import mongoose from 'mongoose';
const schema = new mongoose.Schema({ workflowId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workflow', required: true, index: true }, agentName: String, input: mongoose.Schema.Types.Mixed, output: mongoose.Schema.Types.Mixed, status: String, error: String, stack: String }, { timestamps: true });
export const WorkflowLog = mongoose.model('WorkflowLog', schema);
