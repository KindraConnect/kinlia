from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
"""SQLAlchemy models for the application."""

from datetime import datetime

from .database import Base


class User(Base):
    __tablename__ = "users"

    """Registered user account."""

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)


class Organizer(Base):
    __tablename__ = "organizers"

    """User that can create events."""

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True)

    user = relationship("User")


class Event(Base):
    __tablename__ = "events"

    """Event that users can attend."""

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    date = Column(DateTime, nullable=False, default=datetime.utcnow)
    location = Column(String, nullable=False)
    organizer_id = Column(Integer, ForeignKey("organizers.id"), nullable=False)

    organizer = relationship("Organizer")


class Ticket(Base):
    __tablename__ = "tickets"

    """Ticket purchase linking a user and an event."""

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("events.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    event = relationship("Event")
    user = relationship("User")


class Signup(Base):
    __tablename__ = "signups"

    """Basic contact form submissions."""

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    phone = Column(String, nullable=False)
