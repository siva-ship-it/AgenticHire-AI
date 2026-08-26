import { readFile } from 'node:fs/promises';
import pdf from 'pdf-parse';

export async function resumeParserAgent({ filePath, candidate }) {
  const parsed = await pdf(await readFile(filePath));
  const text = parsed.text.replace(/\s+/g, ' ').trim();
  if (!text) throw Object.assign(new Error('The PDF contains no extractable text'), { code: 'INVALID_PDF' });
  const skillVocabulary = ['React', 'JavaScript', 'TypeScript', 'CSS', 'Next.js', 'Tailwind CSS', 'Node.js', 'Express', 'MongoDB', 'Python', 'Java', 'AWS'];
  const skills = skillVocabulary.filter((skill) => new RegExp(`\\b${skill.replace('.', '\\.')}\\b`, 'i').test(text));
  const years = [...text.matchAll(/(\d+)\+?\s+years?/gi)].map((match) => Number(match[1]));
  const education = text.match(/(B\.?Tech|Bachelor(?:'s)?|Master(?:'s)?|BSc|MSc|PhD)[^.;]*/i)?.[0] || 'Not specified';
  return { success: true, data: { name: candidate.name, skills, experience: years.length ? Math.max(...years) : 0, education, text } };
}
