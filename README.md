# Zero Trust Student Portal — Vercel deployment package

This package keeps the original React UI, CSS, page flow, Express routes, JWT login, MongoDB model, and Zero Trust profile middleware. Only deployment wiring was changed:

- The React/Vite build is emitted to the repository-root `public/` folder for Vercel's static CDN.
- The existing Express application is exported through the root `server.js` entry point for Vercel's Express runtime.
- The frontend calls the same-origin `/api` path instead of `http://localhost:5000`; Vite proxies `/api` to the local backend during development.
- MongoDB connections are cached and awaited before API requests, which is suitable for serverless invocations.
- `bcryptjs` is used instead of the native `bcrypt` package. It uses the bcrypt hash format and remains compatible with existing bcrypt password hashes.
- The uploaded `.env` file and all `node_modules` directories were excluded. No credentials are embedded in this package.

## Deploy to Vercel

1. Upload the **contents** of this folder to a new Git repository (the root `package.json`, root `server.js`, and `vercel.json` must be at the repository root).
2. Import that repository into Vercel.
3. Use the repository root as the Vercel Root Directory.
4. Framework preset: **Express** (also pinned in `vercel.json`).
5. Build Command: `npm run build` (also pinned in `vercel.json`).
6. Do not set a separate Output Directory. The Vite build writes static files to root `public/`, which Vercel serves through its CDN for Express projects.
7. Add the following Vercel Environment Variables for Production (and Preview if needed):
   - `MONGO_URI` — your MongoDB Atlas connection string.
   - `JWT_SECRET` — a long, random secret used to sign JWTs.
8. Redeploy after adding/changing environment variables.

The app's existing API routes are served by the Express function:

- `POST /api/users`
- `POST /api/login`
- `GET /api/profile`

## Local development

Install dependencies from the repository root:

```bash
npm install
```

Create `backend/.env` using `backend/.env.example` and put in your own MongoDB connection string and JWT secret.

Terminal 1 — backend:

```bash
npm run start:backend
```

Terminal 2 — frontend:

```bash
npm run dev
```

The Vite development server proxies `/api` requests to `http://localhost:5000`.

## Production build check

```bash
npm run build
```

This creates the production frontend in root `public/`.

## Important credential notice

The source ZIP supplied for modification contained a real-looking MongoDB connection string and JWT secret in `backend/.env`. That file was deliberately not copied into this deployment package. Treat those values as exposed: rotate the MongoDB database user's password in MongoDB Atlas, generate a new JWT secret, then set the replacement values in Vercel Environment Variables. Do not commit `backend/.env`.

## Functionality and scope

No React component, page content, stylesheet, iconography, page state, or existing API route was redesigned. The academics, attendance, marks, and notifications content remains exactly as in the supplied project; if those sections used hardcoded demonstration values in the original, they remain demonstration values here. Login and protected profile access continue to depend on MongoDB, a valid user record, and the configured JWT secret.
