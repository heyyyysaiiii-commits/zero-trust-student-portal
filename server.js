// Vercel's Express framework detects this root-level server entry point.
// The existing Express routes and middleware remain in backend/server.js.
require("express");
const app = require("./backend/server");

module.exports = app;
