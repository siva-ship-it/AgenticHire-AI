import { chunkText, localEmbedding } from '../src/services/rag.service.js';

describe('RAG utilities', () => {
  test('chunks text according to the supplied spec size', () => {
    expect(chunkText('abcdefghij', 4)).toEqual(['abcd', 'efgh', 'ij']);
  });

  test('creates deterministic normalized vectors', () => {
    const first = localEmbedding('React JavaScript React', 16);
    const second = localEmbedding('React JavaScript React', 16);
    expect(first).toEqual(second);
    expect(first).toHaveLength(16);
    expect(Math.hypot(...first)).toBeCloseTo(1);
  });
});
