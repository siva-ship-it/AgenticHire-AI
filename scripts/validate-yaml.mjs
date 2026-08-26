import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { parseDocument } from 'yaml';

const rootFiles = ['docker-compose.yml', 'docker-compose.production.yml', 'render.yaml', 'redocly.yaml', 'docs/openapi.yaml', '.github/dependabot.yml'];
const directories = ['.github/workflows', '.github/ISSUE_TEMPLATE'];
const files = [...rootFiles];

for (const directory of directories) {
  for (const name of await readdir(directory)) {
    if (/\.ya?ml$/i.test(name)) files.push(path.join(directory, name));
  }
}

let failed = false;
for (const file of files) {
  const document = parseDocument(await readFile(file, 'utf8'), { prettyErrors: true, uniqueKeys: true });
  if (document.errors.length) {
    failed = true;
    console.error(`${file}:`);
    for (const error of document.errors) console.error(`  ${error.message}`);
  } else {
    console.log(`valid ${file}`);
  }
}

if (failed) process.exitCode = 1;
