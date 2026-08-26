export async function interviewAgent({ job, parsedResume }) {
  const skills = [...new Set([...(job.requiredSkills || []), ...(parsedResume.skills || [])])].slice(0, 5);
  return { success: true, data: { questions: skills.map((skill) => `Describe a production challenge you solved using ${skill}.`), codingTask: `Build a small ${job.title} exercise demonstrating ${skills.join(', ')}.`, rubric: { correctness: 40, quality: 30, communication: 30 } } };
}
