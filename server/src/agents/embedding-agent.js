import { storeResume } from '../services/rag.service.js';
export async function embeddingAgent({ candidate, parsedResume }) { return { success: true, data: await storeResume(candidate._id, parsedResume.text) }; }
