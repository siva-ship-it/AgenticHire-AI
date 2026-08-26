import { loadSpec } from '../src/utils/spec-loader.js';
test('loads shared specs and blocks traversal', async () => { expect((await loadSpec('system/retry-policy.json')).max_retries).toBe(3); await expect(loadSpec('../spec.md')).rejects.toThrow('Invalid spec path'); });
