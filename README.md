# Zero Trust Student Portal

A Vite + React prototype demonstrating the student access flow described in the supplied internship report:

**Student Login -> Security Verification -> Identity Verification -> Device Verification -> Risk Assessment -> Grant Secure Access -> Student Dashboard**

## Demo account

- Student ID: `STU001`
- Password: `Rahul123`

The sample account is provided for academic evaluation. The password is checked in the browser because the report describes the current implementation as a frontend prototype and identifies real backend authentication, authorization, dynamic risk evaluation and security logging as future-development work. **Do not use this demo authentication design for real student records or production access control.** The credential is visible in the client source/bundle.

## Features represented from the report

- Student login screen.
- Security verification screen with identity, device and risk checks.
- Prototype risk score of **15 / 100 (Low Risk)**.
- Grant Secure Access step.
- Student dashboard with Academics, Attendance, Examination Marks and Notifications.
- Back-to-dashboard navigation and Logout.

The academic values, marks, dates and notifications are illustrative sample content copied from the report's case-study screenshots/text. They are not live college records.

## Vercel deployment

This repository is arranged for the existing Vercel Express project:

- Root Directory: repository root
- Framework Preset: Express (also declared in `vercel.json`)
- Build Command: `npm run build`
- Output Directory: leave unset
- Install Command: `npm install`

The Vite build writes the production files to root `public/`. The Express app serves that directory. No MongoDB connection string, JWT secret, or environment variables are required for this prototype.

## Overlay this ZIP onto your existing repository

The companion ZIP is an **overlay archive**: it has `backend/`, `frontend/`, `package.json`, `server.js`, and `vercel.json` directly at its root (no enclosing folder). Extract it into the root of your existing local repository and allow files to be overwritten. Do not delete the `.git` folder.

After extraction, from the repository root run:

```bash
git status
git add -A
git commit -m "Align Zero Trust Student Portal with internship report prototype"
git push origin main
```

Pushing to `main` should trigger the existing Vercel project to deploy again. Vercel installs dependencies and builds the frontend; Node/npm are not required on your local machine just to push the source.

## Local development (optional)

Requires Node.js 22 and npm:

```bash
npm install
npm run dev
```

For a production-style local build and Express static server:

```bash
npm run build
npm start
```

Open `http://localhost:5000`.

## Health check

After deployment, `/health` returns a small JSON status response. The site root `/` serves the React portal.

## Scope and security limitations

The 15/100 score is a fixed demonstration value, matching the report. Device verification and risk assessment are represented at the prototype/interface level; the app does not read endpoint posture, calculate dynamic risk, or connect to a live identity provider. The demo login is client-side and must not be treated as real authentication. MongoDB, server-side user management, JWT authentication, dynamic risk evaluation and security logging can be added as a later development phase.
