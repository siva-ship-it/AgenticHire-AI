import { applicationSchema, jobSchema, signupSchema } from '../src/validators/schemas.js';

describe('request validators', () => {
  test('accepts a complete job and applies spec defaults', () => {
    const value = jobSchema.parse({ title: 'Frontend Developer', companyName: 'Example Ltd', location: 'London, UK', description: 'Build accessible web products.', requiredSkills: ['React'], preferredSkills: [] });
    expect(value.employmentType).toBe('FULL_TIME');
    expect(value.hiringSpecId).toBe('hiring/frontend-developer.json');
  });

  test('rejects unsafe spec paths', () => {
    expect(() => jobSchema.parse({ title: 'Developer', companyName: 'Example Ltd', location: 'Remote', description: 'A sufficiently detailed description.', hiringSpecId: '../secret.json' })).toThrow();
  });

  test('requires valid public application identifiers', () => {
    expect(applicationSchema.safeParse({ name: 'A', email: 'bad', jobId: '123' }).success).toBe(false);
  });

  test('enforces strong signup input', () => {
    expect(signupSchema.safeParse({ name: 'Recruiter', email: 'r@example.com', password: 'short' }).success).toBe(false);
  });
});
