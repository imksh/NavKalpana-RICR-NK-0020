# API Documentation (Gradify)

This file documents currently implemented backend APIs for hackathon/demo usage.

## Base URLs

- Local: `http://localhost:5001`
- Production: `https://navkalpana-ricr-nk-0020.onrender.com`

## Authentication & Authorization

- Auth mechanism: JWT (Bearer token and/or secure cookie flow depending on client implementation)
- Header format: `Authorization: Bearer <token>`
- Protected endpoints use `protectedRoute` middleware.
- Some endpoints also use role guards:
  - `adminProtect`
  - `studentProtect`

## Content Types

- Default: `application/json`
- File uploads use `multipart/form-data`:
  - `image` (profile photo update)
  - `file` (assignment submission)
  - `resume` (job application)

## Standard Response Pattern (Recommended)

### Success

```json
{
  "success": true,
  "message": "Request successful",
  "data": {}
}
```

### Error

```json
{
  "success": false,
  "message": "Validation failed",
  "error": {
    "code": "BAD_REQUEST",
    "details": []
  }
}
```

---

## Health / Root

| Method | Endpoint | Access | Description                                     |
| ------ | -------- | ------ | ----------------------------------------------- |
| GET    | `/`      | Public | Server health root route (`Server is running`). |

---

## Auth APIs (`/api/auth`)

| Method | Endpoint           | Access                            | Description                                 |
| ------ | ------------------ | --------------------------------- | ------------------------------------------- |
| POST   | `/register`        | Public                            | Register user account.                      |
| POST   | `/login`           | Public                            | Login user (`loginLimiter` applied).        |
| POST   | `/logout`          | Protected                         | Logout current session.                     |
| GET    | `/check`           | Protected                         | Verify auth and fetch current auth context. |
| POST   | `/gen-otp`         | Public                            | Generate OTP for password reset flow.       |
| POST   | `/verify-otp`      | Public                            | Verify OTP validity.                        |
| PUT    | `/reset-password`  | Public (with reset middleware)    | Reset password using verified flow.         |
| PATCH  | `/update-profile`  | Protected                         | Update user profile fields.                 |
| PUT    | `/change-photo`    | Protected (`multipart/form-data`) | Upload/update user profile image.           |
| PUT    | `/change-password` | Protected                         | Change password for logged-in user.         |

### Example cURL (Login)

```bash
curl -X POST "http://localhost:5001/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"student@example.com","password":"Password@123"}'
```

---

## Public APIs (`/api/public`)

| Method | Endpoint                  | Access | Description                                         |
| ------ | ------------------------- | ------ | --------------------------------------------------- |
| POST   | `/newsletter`             | Public | Subscribe user to newsletter (`newsletterLimiter`). |
| GET    | `/newsletter/unsubscribe` | Public | Unsubscribe from newsletter.                        |
| POST   | `/message`                | Public | Send contact/support message (`contactLimiter`).    |
| POST   | `/track`                  | Public | Track visitor analytics (`trackLimiter`).           |
| GET    | `/alumni`                 | Public | Fetch alumni list.                                  |
| GET    | `/alumni/stats`           | Public | Fetch alumni statistics.                            |

---

## Admin APIs (`/api/admin`)

| Method | Endpoint                  | Access            | Description                              |
| ------ | ------------------------- | ----------------- | ---------------------------------------- |
| POST   | `/`                       | Protected + Admin | Create alumni record.                    |
| POST   | `/send-test-notification` | Protected + Admin | Send test push notification to students. |

---

## Student APIs (`/api/student`)

| Method | Endpoint                  | Access                            | Description                         |
| ------ | ------------------------- | --------------------------------- | ----------------------------------- |
| GET    | `/stats`                  | Protected + Student               | Student dashboard stats.            |
| GET    | `/learning-activity`      | Protected + Student               | Learning activity timeline/summary. |
| GET    | `/courses`                | Protected + Student               | Enrolled/available student courses. |
| GET    | `/assignments`            | Protected                         | List student assignments.           |
| GET    | `/assignments/:id`        | Protected                         | Get assignment details by ID.       |
| POST   | `/assignments/:id/submit` | Protected (`multipart/form-data`) | Submit assignment file.             |
| GET    | `/attendance`             | Protected                         | Get attendance data.                |
| GET    | `/attendance/report`      | Protected                         | Download attendance report.         |
| GET    | `/progress`               | Protected                         | Skill/course progress summary.      |
| GET    | `/growth-dashboard`       | Protected + Student               | Growth analytics dashboard data.    |
| GET    | `/quizzes`                | Protected                         | List quizzes for student.           |
| GET    | `/quizzes/:id`            | Protected                         | Get quiz details by ID.             |
| POST   | `/quizzes/submit`         | Protected                         | Submit quiz attempt.                |
| GET    | `/quizzes/:id/result`     | Protected                         | Fetch quiz result.                  |
| GET    | `/leaderboard`            | Protected                         | Leaderboard rankings.               |
| GET    | `/events/upcoming`        | Protected                         | Upcoming events list.               |
| GET    | `/events`                 | Protected                         | All available events.               |
| POST   | `/lesson/:id/opened`      | Protected                         | Mark lesson as opened/started.      |
| POST   | `/book-session`           | Protected                         | Book mentoring/support session.     |
| GET    | `/sessions`               | Protected                         | Fetch student sessions.             |
| POST   | `/doubts`                 | Protected                         | Create doubt/question ticket.       |
| GET    | `/doubts`                 | Protected                         | List student doubts.                |

### Example cURL (Assignment Submission)

```bash
curl -X POST "http://localhost:5001/api/student/assignments/<assignmentId>/submit" \
  -H "Authorization: Bearer <token>" \
  -F "file=@./solution.pdf"
```

---

## Instructor APIs (`/api/instructor`)

Current router exists but no endpoints are exposed yet in the route file.

| Method | Endpoint | Access                 | Description                                 |
| ------ | -------- | ---------------------- | ------------------------------------------- |
| -      | -        | Protected + Instructor | Add when instructor routes are implemented. |

---

## Course APIs (`/api/course`)

| Method | Endpoint                      | Access    | Description               |
| ------ | ----------------------------- | --------- | ------------------------- |
| GET    | `/:slug`                      | Protected | Get course by slug.       |
| GET    | `/:id/modules`                | Protected | Get modules for a course. |
| GET    | `/lesson/:slug`               | Protected | Get lesson by slug.       |
| GET    | `/module/:id/lessons`         | Protected | Get lessons by module ID. |
| PUT    | `/lesson/:lessonId/completed` | Protected | Mark lesson as completed. |

---

## Job APIs (`/api/jobs`)

| Method | Endpoint                | Access                            | Description                      |
| ------ | ----------------------- | --------------------------------- | -------------------------------- |
| GET    | `/`                     | Protected                         | Get all jobs.                    |
| GET    | `/:id`                  | Protected                         | Get job details by ID.           |
| POST   | `/:id/apply`            | Protected (`multipart/form-data`) | Apply to job with resume upload. |
| GET    | `/jobs/my-applications` | Protected                         | Fetch current user applications. |

### Route Note

In many Express setups, placing `/:id` before `/jobs/my-applications` can shadow specific routes. If you face incorrect matching, move `/jobs/my-applications` above `/:id`.

---

## AI APIs (`/api/ai`)

| Method | Endpoint                        | Access              | Description                          |
| ------ | ------------------------------- | ------------------- | ------------------------------------ |
| GET    | `/models`                       | Protected + Student | List available AI models.            |
| POST   | `/chat`                         | Protected + Student | Send prompt/message to AI.           |
| GET    | `/conversation/:conversationId` | Protected           | Fetch specific conversation history. |
| GET    | `/conversations`                | Protected + Student | List user conversations.             |
| DELETE | `/conversation/:conversationId` | Protected + Student | Delete one conversation.             |
| POST   | `/quiz-review`                  | Protected + Student | AI-assisted quiz review/explanation. |

---

## Push Notification APIs (`/api/push`)

| Method | Endpoint                | Access    | Description                          |
| ------ | ----------------------- | --------- | ------------------------------------ |
| POST   | `/web-push-subscribe`   | Protected | Save web push subscription.          |
| POST   | `/web-push-unsubscribe` | Protected | Remove web push subscription.        |
| GET    | `/push`                 | Protected | Trigger/test push notification flow. |

---

## Common HTTP Status Codes

- `200` OK
- `201` Created
- `204` No Content
- `400` Bad Request
- `401` Unauthorized
- `403` Forbidden
- `404` Not Found
- `409` Conflict
- `422` Unprocessable Entity
- `429` Too Many Requests
- `500` Internal Server Error

## Suggested Hackathon Add-ons

To make this documentation judge-friendly, add these artifacts:

1. Postman collection JSON export (`docs/postman-collection.json`)
2. One end-to-end flow section (e.g., register → login → enroll → submit quiz)
3. 3-5 real request/response examples captured from your running backend
4. Error matrix for auth, validation, and rate limit scenarios

## Versioning

- Current codebase versioning style: unversioned (`/api/...`)
- Suggested future pattern: `/api/v1/...`

## Security Notes

- Keep all secrets in environment variables only.
- Apply input validation/sanitization on all write routes.
- Enforce role guards on sensitive routes.
- Keep rate limits on auth/public endpoints.
