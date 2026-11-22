import axios from "axios";

// Same-origin API path: works on Vercel and through the Vite dev proxy locally.
const API = axios.create({
  baseURL: "/api",
});

export default API;
