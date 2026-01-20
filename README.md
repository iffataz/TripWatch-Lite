# TripWatch Lite (WIP)

A small, event-driven full-stack project inspired by travel deal monitoring:
**React + TypeScript frontend**, **Node.js + TypeScript backend**, and an **AWS Lambda worker**
that processes deal checks via **SQS** and sends alerts via **SNS**.

## Goals
- Separate frontend and backend
- Event-driven pipeline: API → SQS → Lambda → SNS
- Postgres persistence for watch rules and price snapshots
- CI/CD (GitHub Actions) for lint/typecheck/tests + deployment

## Architecture (placeholder)

[Frontend (React)]
  |
  | REST
  v
[Backend API (Node/TS)] ---> [SQS Queue] ---> [Lambda Worker (TS)] ---> [SNS Topic] ---> Email
         |                         |
         |                         v
         +-----> [Postgres] <--- writes snapshots + rules

## Local setup (placeholder)
- `docker compose up -d` (Postgres)
- `npm install`
- `npm run dev`

## Project status
Scaffolding and tooling setup complete. Next: API endpoints + worker pipeline.
