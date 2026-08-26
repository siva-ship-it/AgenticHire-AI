import { loadSpec } from '../utils/spec-loader.js';
export async function shortlistingAgent({ match }) {
  const spec = await loadSpec('evaluation/default.json');
  const decision = [...spec.decisions].sort((a, b) => b.minimum_score - a.minimum_score).find((x) => match.match_score >= x.minimum_score);
  return { success: true, data: { status: decision.status, match_score: match.match_score } };
}
