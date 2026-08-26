import { QdrantClient } from '@qdrant/js-client-rest';
import { env } from '../config/env.js';
import { loadSpec } from '../utils/spec-loader.js';

const client = new QdrantClient({ url: env.QDRANT_URL, apiKey: env.QDRANT_API_KEY, checkCompatibility: false });
export function chunkText(text, size) { return text.match(new RegExp(`[\\s\\S]{1,${size}}`, 'g')) || []; }

// A deterministic local embedding keeps development usable without paid APIs.
export function localEmbedding(text, dimensions) {
  const vector = new Array(dimensions).fill(0);
  for (const token of text.toLowerCase().match(/[a-z0-9+#.]+/g) || []) {
    let hash = 0; for (const char of token) hash = ((hash << 5) - hash + char.charCodeAt(0)) | 0;
    vector[Math.abs(hash) % dimensions] += 1;
  }
  const norm = Math.hypot(...vector) || 1;
  return vector.map((x) => x / norm);
}

export async function storeResume(candidateId, text) {
  const spec = await loadSpec('system/rag.json');
  try {
    const collections = await client.getCollections();
    if (!collections.collections.some((x) => x.name === spec.collection)) await client.createCollection(spec.collection, { vectors: { size: spec.dimensions, distance: 'Cosine' } });
    const chunks = chunkText(text, spec.chunk_sizes.resume);
    const baseId = Number.parseInt(candidateId.toString().slice(-8), 16) * 1000;
    await client.upsert(spec.collection, { wait: true, points: chunks.map((chunk, index) => ({ id: baseId + index, vector: localEmbedding(chunk, spec.dimensions), payload: { candidateId: candidateId.toString(), type: 'resume', text: chunk } })) });
    return { stored: chunks.length };
  } catch (error) {
    error.code = 'VECTOR_DB_TIMEOUT'; throw error;
  }
}

export async function retrieveContext(query) {
  const spec = await loadSpec('system/rag.json');
  try {
    const hits = await client.search(spec.collection, { vector: localEmbedding(query, spec.dimensions), limit: spec.top_k, score_threshold: spec.minimum_similarity, with_payload: true });
    return hits.map((x) => x.payload?.text).filter(Boolean);
  } catch { return []; }
}
