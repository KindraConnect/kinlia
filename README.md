# kinlia

This project provides a basic setup with an Expo frontend and a FastAPI backend.

## Getting started

1. Copy `.env.example` to `.env` and modify the values if needed.
2. Start all services with:

```bash
docker-compose up
```

The Expo server will be available on [http://localhost:3412](http://localhost:3412) and the FastAPI backend on [http://localhost:8194](http://localhost:8194).

## Database migrations

To create and apply database migrations run:

```bash
docker-compose exec backend alembic revision --autogenerate -m "<message>"
docker-compose exec backend alembic upgrade head
```

## Background worker

Matching jobs are processed by an RQ worker. Start it with Docker:

```bash
docker-compose up worker
```


## Makefile

Common commands are available via the Makefile:

```bash
make dev      # start all services
make migrate  # apply migrations
```

## Continuous Integration

A GitHub Actions workflow (`.github/workflows/ci.yml`) runs on every push and
pull request. It installs dependencies, lints and tests the backend, and builds
both Docker images to ensure they succeed.

