import app from "../artifacts/api-server/src/app";

// Vercel invokes this exported Express app as the single-project API
// function. The local/Replit listener remains in artifacts/api-server/src.
export default app;
