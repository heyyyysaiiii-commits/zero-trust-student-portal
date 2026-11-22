const express = require("express");

const app = express();

// Import the existing backend application.
const backendApp = require("./backend/server");

// Mount existing backend routes and middleware.
app.use(backendApp);

// Export the Express application for Vercel.
module.exports = app;
