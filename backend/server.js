const express = require("express");
const path = require("path");

const app = express();
const publicDirectory = path.resolve(__dirname, "../public");

app.disable("x-powered-by");
app.use(express.json({ limit: "100kb" }));

// The Vite build writes the report-matching React prototype into the root public/ folder.
// Serving this directory at '/' ensures Vercel returns the student portal UI, not a backend message.
app.use(express.static(publicDirectory, { index: "index.html" }));

// Lightweight health endpoint for deployment checks.
app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "Zero Trust Student Portal",
    mode: "academic-demo-prototype",
  });
});

// Local optional server. Vercel imports the exported Express app as a serverless function.
if (require.main === module) {
  const port = Number(process.env.PORT) || 5000;
  app.listen(port, () => {
    console.log(`Zero Trust Student Portal available at http://localhost:${port}`);
  });
}

module.exports = app;
