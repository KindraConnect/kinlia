import os
from redis import Redis
from rq import Queue

# Configure Redis connection
redis_url = os.getenv("REDIS_URL", "redis://redis:6379")
redis_conn = Redis.from_url(redis_url)
queue = Queue(connection=redis_conn)


def match_event_to_users(event_id: int):
    """Placeholder task that would match an event to interested users."""
    print(f"Processing matching for event {event_id}")


def enqueue_match_event(event_id: int):
    """Helper to enqueue a matching job."""
    queue.enqueue(match_event_to_users, event_id)
