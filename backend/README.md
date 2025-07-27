# Backend

This directory contains the FastAPI backend service.

## Running migrations

Alembic is configured to use the `DATABASE_URL` environment variable.
To create a new migration and apply it, run:

```bash
docker-compose exec backend alembic revision --autogenerate -m "<message>"
docker-compose exec backend alembic upgrade head
```
