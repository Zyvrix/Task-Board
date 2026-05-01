# Task Board Assignment

A small full-stack task board built for the Digitally Next full-stack developer assignment.

## Assignment Requirement Coverage

This application includes both required parts:

- **Backend**: Next.js server actions in `app/actions.ts` handle signup, login, logout, task creation, and status updates.
- **Database**: SQLite relational database is used with Prisma ORM. The schema is defined in `prisma/schema.prisma`.

It is not a static-only frontend app. All user accounts, sessions, and tasks are stored in the database.

## Tech Stack

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- Prisma ORM
- SQLite relational database
- Cookie-based sessions
- bcrypt password hashing
- Zod input validation

## Project Workflow

1. User opens the app.
2. If there is no valid session cookie, the app shows the signup screen.
3. User can create an account or switch to the login form.
4. Signup/login submits to server actions, not client-only logic.
5. Passwords are validated and hashed with bcrypt before storage.
6. A session token is generated on the server and saved in the `Session` table.
7. The session token is stored in an HTTP-only cookie.
8. After authentication, the server loads only the logged-in user's tasks.
9. User creates a task. The task is saved in the `Task` table with the logged-in user's `userId`.
10. User updates task status. The server validates the status and updates only tasks owned by that user.
11. On logout, the session row is deleted and the cookie is cleared.

## Features

- User signup and login
- Secure password hashing
- Authenticated session stored in an HTTP-only cookie
- Create tasks with a title
- View tasks created by the logged-in user only
- Update task status between `Todo`, `In Progress`, and `Done`
- Basic loading, empty, and responsive UI states

## Folder Structure

```text
app/
  actions.ts        Server actions for auth and task mutations
  page.tsx          Server-rendered home page, auth gate, task loading
  layout.tsx        Root layout and metadata
  globals.css       Tailwind/global styles

components/
  AuthPanel.tsx     Signup/login UI
  TaskBoard.tsx     Logged-in task board UI
  TaskForm.tsx      Create task form
  SubmitButton.tsx  Pending-state submit button

lib/
  auth.ts           Session cookie and current-user lookup
  prisma.ts         Prisma Client singleton

prisma/
  schema.prisma     User, Session, and Task relational schema

scripts/
  init-db.mjs       Local SQLite table initialization
```

## Authentication Flow

1. A user signs up with name, email, and password.
2. The password is hashed with bcrypt before storage.
3. On signup or login, the server creates a session row with a random token.
4. The token is stored in an HTTP-only cookie named `task_board_session`.
5. Server-rendered pages and server actions read that cookie, load the matching session, and only return data for the current user.
6. Signing out deletes the session from the database and clears the cookie.

## Database Schema

The app uses three relational tables:

- `User`: account data, including unique email and hashed password.
- `Session`: login sessions linked to a user with an expiry date.
- `Task`: task title, status, timestamps, and `userId` foreign key.

Relationships:

- One user has many sessions.
- One user has many tasks.
- Deleting a user cascades to their sessions and tasks.

The Prisma schema is in `prisma/schema.prisma`.

## Main Implementation Details

- `User.email` is unique, so duplicate signup is blocked.
- `User.passwordHash` stores only the hashed password, never the plain password.
- `Session.token` is a random server-generated token.
- The session cookie is HTTP-only, so browser JavaScript cannot read it.
- `Task.userId` links each task to its owner.
- Task queries use `where: { userId: user.id }`, so users only see their own tasks.
- Task status updates use `updateMany` with both `id` and `userId`, so a user cannot update another user's task by guessing an ID.
- Zod validates email, password length, task title, and allowed task statuses.

## Interview Explanation

You can explain the project like this:

> I built a small full-stack task board using Next.js App Router, TypeScript, Prisma, SQLite, and Tailwind CSS. The app has custom authentication with bcrypt password hashing and HTTP-only cookie sessions. After login, each user can create tasks, view only their own tasks, and update task status between Todo, In Progress, and Done. The backend is implemented with server actions, and the relational database has User, Session, and Task tables with proper foreign-key relationships.

Important points to mention:

- I used a relational database as required, not Firebase or MongoDB.
- I used Prisma as the ORM.
- Authentication is server-side and stores hashed passwords.
- The UI is intentionally simple because the assignment prioritizes correctness and fundamentals.
- The application has real backend mutations and database persistence.
- Data ownership is enforced server-side through `userId` checks.

## Run Locally

Install dependencies:

```bash
npm install
```

Create the SQLite database and generate Prisma Client:

```bash
npm run db:push
```

Start the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Useful Commands

```bash
npm run lint
npm run build
npm run db:studio
```

## Environment Variables

Create `.env` from `.env.example`:

```bash
DATABASE_URL="file:../dev.db"
```

The relative path is resolved by Prisma from the `prisma/` directory, so this points to `dev.db` in the project root.

## Deployment

Deployment is optional for the assignment. If deployed, use Vercel or Render and provide the live URL here.

Live URL: Not deployed yet.
