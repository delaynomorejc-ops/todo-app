# Tasks

A minimal hierarchical todo list app. Data is stored locally as JSON, with a simple API for syncing between machines.

## Getting Started

```bash
npm install
cp .env.example .env   # edit PORT if needed
npm run build
npm start
```

Open http://localhost:3000

## Development

```bash
# Terminal 1 — API server
node server.js

# Terminal 2 — Vite dev server with HMR
npm run dev:client
```

Open http://localhost:5173

## Sync Between Machines

Run the server on both machines:

```bash
npm install && cp .env.example .env && npm run build
npm start
```

To pull data from another machine on the same network:

```bash
# Fetch from another machine (replace with its local IP)
curl http://192.168.x.x:3001/api/todos > sync.json
curl -X POST http://localhost:3001/api/todos \
  -H 'Content-Type: application/json' \
  -d @sync.json
```

Or simply copy `todos.json` between machines.

## Data

All tasks are saved to `todos.json` in the project root. This file is excluded from git.
