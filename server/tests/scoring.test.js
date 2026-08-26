import { calculateMatch } from '../src/services/scoring.service.js';

describe('spec-driven scoring', () => {
  const evaluation = { weights: { required_skills: 70, preferred_skills: 20, experience: 10 }, decisions: [{ status: 'shortlisted', minimum_score: 80 }, { status: 'hold', minimum_score: 60 }, { status: 'rejected', minimum_score: 0 }] };
  test('uses supplied weights and thresholds', () => {
    const result = calculateMatch({ skills: ['React', 'JavaScript', 'CSS', 'Next.js'], experience: 2 }, { required_skills: ['React', 'JavaScript', 'CSS'], preferred_skills: ['Next.js', 'Tailwind CSS'], min_experience: 2 }, evaluation);
    expect(result).toEqual({ matchScore: 90, missingSkills: ['Tailwind CSS'], recommendation: 'shortlisted' });
  });
  test('does not hardcode a decision boundary', () => {
    const custom = { ...evaluation, decisions: [{ status: 'pass', minimum_score: 50 }, { status: 'fail', minimum_score: 0 }] };
    expect(calculateMatch({ skills: ['React'], experience: 0 }, { required_skills: ['React', 'CSS'], preferred_skills: ['Vue'], min_experience: 2 }, custom).recommendation).toBe('fail');
  });
});
