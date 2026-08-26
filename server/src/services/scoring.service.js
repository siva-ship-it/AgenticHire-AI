export function calculateMatch(parsedResume, hiringSpec, evaluationSpec) {
  const normalized = new Set((parsedResume.skills || []).map((x) => x.toLowerCase()));
  const ratio = (items) => items.length ? items.filter((x) => normalized.has(x.toLowerCase())).length / items.length : 1;
  const required = ratio(hiringSpec.required_skills || []);
  const preferred = ratio(hiringSpec.preferred_skills || []);
  const requiredExperience = hiringSpec.min_experience || 0;
  const experience = requiredExperience ? Math.min((parsedResume.experience || 0) / requiredExperience, 1) : 1;
  const weights = evaluationSpec.weights;
  const matchScore = Math.round(required * weights.required_skills + preferred * weights.preferred_skills + experience * weights.experience);
  const missingSkills = [...(hiringSpec.required_skills || []), ...(hiringSpec.preferred_skills || [])].filter((x) => !normalized.has(x.toLowerCase()));
  const decision = [...evaluationSpec.decisions].sort((a, b) => b.minimum_score - a.minimum_score).find((x) => matchScore >= x.minimum_score);
  return { matchScore, missingSkills, recommendation: decision.status };
}
