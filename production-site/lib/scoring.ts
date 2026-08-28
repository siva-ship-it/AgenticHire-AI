export type ScoreResult = { score: number; matched: string[]; missing: string[] };

export function splitSkills(value: string): string[] {
  const skills = value.split(',').map((skill) => skill.trim()).filter(Boolean);
  return skills.filter((skill, index) => skills.findIndex((item) => item.toLowerCase() === skill.toLowerCase()) === index);
}

export function scoreCandidate(requiredSkills: string[], candidateSkills: string[], summary: string): ScoreResult {
  const normalizedCandidateSkills = new Set(candidateSkills.map((skill) => skill.trim().toLowerCase()));
  const normalizedSummary = summary.toLowerCase();
  const appearsInSummary = (skill: string) => {
    const escaped = skill.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`(^|[^a-z0-9])${escaped}($|[^a-z0-9])`, 'i').test(normalizedSummary);
  };
  const matched = requiredSkills.filter((skill) => normalizedCandidateSkills.has(skill.toLowerCase()) || appearsInSummary(skill));
  const missing = requiredSkills.filter((skill) => !matched.includes(skill));
  const score = requiredSkills.length ? Math.round((matched.length / requiredSkills.length) * 100) : 100;
  return { score, matched, missing };
}
