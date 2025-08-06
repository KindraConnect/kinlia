# Kinlia

**Kinlia is a tiny event app built for vibes.** It blends a Python API and a mobile app so you can learn how the pieces of a modern stack talk to each other.

This repo is friendly on purpose: the goal is to let you poke around, make small changes and see what happens.

## Why these technologies?

| Piece | Why it exists |
|-------|---------------|
| **FastAPI backend** | Python is easy to read and FastAPI gives you a web API with hardly any boilerplate. It also generates docs automatically so you can see and test the endpoints. |
| **Expo + React Native frontend** | One set of JavaScript files runs on both iOS and Android. Expo handles the scary native tooling so you can focus on screens and styles. |
| **Docker Compose** | Containers keep all services isolated. One command starts everything so you don't chase missing packages. |
| **SQLite by default** | For learning you just need a file‑based database. When the app grows you can switch `DATABASE_URL` to Postgres without touching the code. |
| **Redis + RQ worker** | Some jobs (like matching people to events) run in the background. A worker lets the API respond fast while heavy work happens elsewhere. |

## Architecture in plain words

```
Frontend (Expo/React Native) ⇄ Backend API (FastAPI) ⇄ Database (SQLite/Postgres)
                                       ↳ Background Worker (RQ + Redis)
```

1. The **frontend** asks the **backend** for data or sends user actions.
2. The **backend** reads/writes the **database** and sometimes kicks off a background **worker** task.
3. The worker can store extra data (like embeddings) and the cycle continues.

## Getting started

1. **Install [Docker](https://www.docker.com/)**
   - *Why:* It bundles all dependencies. No Python or Node installs needed.
2. **Copy the example environment file**
   - `cp .env.example .env`
   - *Why:* Secrets and config live outside the code so you can change them without editing files.
3. **Run the stack**
   - `make dev` or `docker-compose up`
   - *Why:* Spins up the API, the mobile dev server and the worker in one go.
4. **Open the app**
   - Visit [http://localhost:3412](http://localhost:3412) in a browser or the Expo Go app.
   - The API is at [http://localhost:8194](http://localhost:8194).

## Project layout

```
backend/   → FastAPI service (all the Python code)
frontend/  → Expo React Native app (all the screens)
shared/    → Placeholder for code used by both sides
Makefile   → Handy shortcuts like `make dev`
docker-compose.yml → Defines how the services run together
```

## Where to go next

Ready to keep vibing? Check out the [Next Steps & Implementation Plan](NEXT_STEPS.md).

## Testing

Backend tests use `pytest` and live in `backend/tests`. Run them with:

```bash
cd backend
pytest
```

## Contributing

Questions, ideas or feedback are welcome. Drop notes, open issues, or experiment in your own fork.
