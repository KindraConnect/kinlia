"""Entry point for running the RQ background worker."""

import os
from redis import Redis
from rq import Worker, Queue

redis_url = os.getenv("REDIS_URL", "redis://redis:6379")
listen = ["default"]
conn = Redis.from_url(redis_url)


if __name__ == "__main__":
    queue = Queue(connection=conn)
    worker = Worker([queue], connection=conn)
    worker.work()
