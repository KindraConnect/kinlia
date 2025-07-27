.PHONY: dev migrate worker

dev:
	docker-compose up

migrate:
	docker-compose exec backend alembic upgrade head

worker:
	docker-compose up worker
