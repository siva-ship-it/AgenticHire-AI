import { calculateMatch } from '../services/scoring.service.js';
import { retrieveContext } from '../services/rag.service.js';
import { loadSpec } from '../utils/spec-loader.js';
export async function matchingAgent({ parsedResume, hiringSpec }) {
  const evaluation = await loadSpec('evaluation/default.json');
  const context = await retrieveContext(`${hiringSpec.role} ${(hiringSpec.required_skills || []).join(' ')}`);
  const result = calculateMatch(parsedResume, hiringSpec, evaluation);
  return { success: true, data: { match_score: result.matchScore, missing_skills: result.missingSkills, recommendation: result.recommendation, context } };
}
