# Gradify Frontend

Frontend application for **Gradify – Student Learning & Progress Platform**.

This project is built with React + Vite and provides role-based user interfaces for students, instructors, and admins.

## Tech Stack

- React 19
- Vite 6
- Tailwind CSS 4
- Zustand (state management)
- React Router DOM
- Axios
- i18next (internationalization)
- Recharts (analytics/visualization)

## Prerequisites

- Node.js `>=18`
- npm `>=9`

## Getting Started

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment variables

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_BASE_URL=http://localhost:5001
VITE_APP_NAME=Gradify
VITE_VAPID_PUBLIC_KEY=<your_vapid_public_key>
```

### 3) Run development server

```bash
npm run dev
```

The app starts on Vite dev server (default: `http://localhost:5173`).

## Available Scripts

- `npm run dev` → Start development server with host access
- `npm run build` → Build production bundle
- `npm run preview` → Preview production build locally
- `npm run lint` → Run ESLint checks

## Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```text
frontend/
├── public/
│   ├── images/
│   ├── manifest.json
│   ├── robots.txt
│   └── sw.js
├── src/
│   ├── assets/
│   ├── components/
│   ├── config/
│   ├── hooks/
│   ├── locales/
│   ├── pages/
│   ├── store/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
├── index.html
└── vite.config.js
```

## Backend Integration

- Ensure backend is running before frontend API calls.
- Expected backend base URL is configured via `VITE_API_BASE_URL`.
- Production backend currently used by project:
  - `https://navkalpana-ricr-nk-0020.onrender.com`

## Deployment

- Recommended platform: Netlify
- Current live frontend URL:
  - `https://imksh-gradify.netlify.app`

### Netlify Build Settings (recommended)

- Build command: `npm run build`
- Publish directory: `dist`

## Quality Notes

- Lint before creating pull requests: `npm run lint`
- Keep environment-specific values in `.env` files only
- Do not hardcode API URLs or secrets in source files

## Documentation Links

- Root project docs: `../README.md`
- API docs: `../docs/api-documentation.md`

## Maintainer

**Karan Kumar**

For project-level details, check the root README in the repository.
