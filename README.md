# Fitness Tracker

Full-stack CSE 412 Phase 03 app for tracking fitness goals, daily activity, and progress.

## Tech Stack

- React frontend
- Node.js and Express backend
- PostgreSQL database using the `pg` driver

## Local Setup

1. Create a PostgreSQL database named `fitness_tracker`.
2. Copy `backend/.env.example` to `backend/.env` and fill in your PostgreSQL username and password.
3. Install backend packages:
   ```bash
   cd backend
   npm install
   npm start
   ```
4. Install frontend packages in a second terminal:
   ```bash
   cd frontend
   npm install
   npm start
   ```
5. Open `http://localhost:3000`.

When the backend starts, it creates the project tables and loads starter goal/activity data.

## Demo Checklist

- Create an account or log in.
- Add a calorie, protein, or fiber goal to show recommendation calculation.
- Record an activity to insert or update today's activity log.
- Delete an activity to show the delete operation.
- Refresh progress to show database-backed read operations.
