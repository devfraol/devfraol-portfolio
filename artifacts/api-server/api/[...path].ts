import app from "../src/app";

// Vercel invokes the exported Express app as a serverless function. The
// standalone listener remains in src/index.ts for local and container usage.
export default app;
