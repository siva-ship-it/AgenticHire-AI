import assert from 'node:assert/strict';
import test from 'node:test';
import { scoreCandidate, splitSkills } from './scoring.ts';

test('splitSkills trims empty values and removes case-insensitive duplicates', () => {
  assert.deepEqual(splitSkills('React, TypeScript, react, , SQL'), ['React', 'TypeScript', 'SQL']);
});

test('scoreCandidate explains matched and missing skills', () => {
  assert.deepEqual(
    scoreCandidate(['React', 'TypeScript', 'SQL'], ['React'], 'Five years using TypeScript in production.'),
    { score: 67, matched: ['React', 'TypeScript'], missing: ['SQL'] },
  );
});

test('short skills do not match inside unrelated words', () => {
  assert.deepEqual(scoreCandidate(['Go'], [], 'Built APIs with Django.'), { score: 0, matched: [], missing: ['Go'] });
});

test('punctuated skills can match a candidate summary', () => {
  assert.equal(scoreCandidate(['C++', 'Node.js'], [], 'C++ and Node.js platform engineer.').score, 100);
});
