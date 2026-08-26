import mongoose from 'mongoose';
const schema = new mongoose.Schema({ name: { type: String, required: true, trim: true }, email: { type: String, required: true, unique: true, lowercase: true, index: true }, password: { type: String, required: true, select: false }, role: { type: String, enum: ['recruiter', 'admin'], default: 'recruiter' } }, { timestamps: true });
export const User = mongoose.model('User', schema);
