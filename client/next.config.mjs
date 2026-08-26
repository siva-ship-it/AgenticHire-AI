import path from 'node:path';
import { fileURLToPath } from 'node:url';
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tracingRoot = process.env.NEXT_OUTPUT_TRACING_ROOT ? path.resolve(process.env.NEXT_OUTPUT_TRACING_ROOT) : projectRoot;
const nextConfig = { reactStrictMode: true, output: 'standalone', outputFileTracingRoot: tracingRoot };
export default nextConfig;
