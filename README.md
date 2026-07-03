# OpenBiz - Full Stack Project Scaffold

This repository contains a starter scaffold for the OpenBiz assignment.

Run instructions:

- Frontend (Vite + React + TypeScript + Tailwind):

  ```bash
  cd frontend
  npm install
  npm run dev
  ```

- Backend (Node + Express + TypeScript + Prisma):

  ```bash
  cd backend
  npm install
  cp .env.example .env
  # set DATABASE_URL in .env then
  npx prisma generate
  npm run dev
  ```
