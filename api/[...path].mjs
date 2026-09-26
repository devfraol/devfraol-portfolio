// This JavaScript adapter keeps Vercel's function compiler outside the
// TypeScript source graph. The API build bundles the canonical Express app
// with the workspace's esbuild configuration before Vercel packages this file.
import app from "../artifacts/api-server/dist/serverless.mjs";

export default app;
