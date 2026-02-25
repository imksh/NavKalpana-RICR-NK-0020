# Gradify Backend

Backend service for **Gradify – Student Learning & Progress Platform**.

This API is built with Express + MongoDB and powers authentication, role-based workflows, student learning modules, AI support, jobs, alumni, and push notifications.

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Cloudinary (file/media storage)
- Nodemailer (email flows)
- Web Push (notifications)
- Groq SDK (AI features)

## Prerequisites

- Node.js `>=18`
- npm `>=9`
- MongoDB Atlas connection string (or local MongoDB)

## Getting Started

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment variables

Create a `.env` file in the `backend/` directory:

```env
NODE_ENV=development
PORT=5001
MONGODB_URI=<your_mongo_uri>
JWT_SECRET=<strong_secret>
JWT_EXPIRES_IN=7d

CLOUDINARY_CLOUD_NAME=<cloudinary_name>
CLOUDINARY_API_KEY=<cloudinary_key>
CLOUDINARY_API_SECRET=<cloudinary_secret>

EMAIL_HOST=<smtp_host>
EMAIL_PORT=<smtp_port>
EMAIL_USER=<smtp_user>
EMAIL_PASS=<smtp_password>

FRONTEND_URL=http://localhost:5173

VAPID_SUBJECT=mailto:you@example.com
VAPID_PRIVATE_KEY=<vapid_private_key>
VAPID_PUBLIC_KEY=<vapid_public_key>

GROQ_API_KEY=<groq_api_key>
GROQ_MODEL=<primary_model>
GROQ_FALLBACK_MODEL=<fallback_model>
```

### 3) Run development server

```bash
npm run dev
```

Server default URL:

- `http://localhost:5001`

## Available Scripts

- `npm run dev` → Start server with nodemon
- `npm start` → Start server in normal mode
- `npm run seed` → Seed baseline data
- `npm run seed:all` → Run all seeders
- `npm run seed:admin` / `seed:user` / `seed:courses` / etc. → Run specific seeders
- `npm run generate:vapID` → Generate VAPID keys for push notifications

## Project Structure

```text
backend/
├── index.js
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routers/
│   ├── seeders/
│   └── utils/
└── package.json
```

## API Modules

Route prefixes mounted in `index.js`:

- `/api/auth`
- `/api/public`
- `/api/admin`
- `/api/student`
- `/api/instructor`
- `/api/course`
- `/api/jobs`
- `/api/ai`
- `/api/push`

Detailed endpoint documentation:

- `../docs/api-documentation.md`

## Security & Middleware

- CORS with whitelisted frontend origins
- Cookie parser + JSON body parsing
- Auth guard middleware (`protectedRoute`)
- Role guards (`adminProtect`, `studentProtect`)
- Rate limiting for auth/public critical routes
- Centralized not-found and error handlers

## Deployment

- Recommended backend hosting: Render
- Current production URL:
  - `https://navkalpana-ricr-nk-0020.onrender.com`

## Notes for Contributors

- Keep secrets in `.env`, never commit credentials.
- Follow existing folder conventions for new modules.
- Add routes in `src/routers`, handlers in `src/controllers`, schemas in `src/models`.
- Validate payloads and enforce role checks on sensitive operations.

## Maintainer

**Karan Kumar**
