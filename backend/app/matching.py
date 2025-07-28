"""Utilities for generating and storing recommendation embeddings."""

from typing import List

from . import models
from .pinecone_client import index


def generate_user_embedding(user: models.User) -> List[float]:
    """Return a placeholder embedding for a user."""
    # TODO: Replace with real model call
    return [0.0] * 128


def generate_event_embedding(event: models.Event) -> List[float]:
    """Return a placeholder embedding for an event."""
    # TODO: Replace with real model call
    return [0.0] * 128


def store_user_embedding(user_id: int, embedding: List[float]):
    """Store a user embedding in Pinecone."""
    if index is None:
        return
    index.upsert([(f"user-{user_id}", embedding)])


def store_event_embedding(event_id: int, embedding: List[float]):
    """Store an event embedding in Pinecone."""
    if index is None:
        return
    index.upsert([(f"event-{event_id}", embedding)])
