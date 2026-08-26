import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../');
const cache = new Map();

export async function loadSpec(relativePath) {
  if (cache.has(relativePath)) return cache.get(relativePath);
  const fullPath = path.resolve(root, 'specs', relativePath);
  const specsRoot = path.resolve(root, 'specs');
  if (!fullPath.startsWith(specsRoot + path.sep)) throw new Error('Invalid spec path');
  const value = JSON.parse(await readFile(fullPath, 'utf8'));
  cache.set(relativePath, value);
  return value;
}

export function clearSpecCache() { cache.clear(); }
