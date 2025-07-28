"""Pydantic schemas used for request and response models."""

from datetime import datetime
from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    """Data required to register a new user."""
    email: EmailStr
    password: str


class UserRead(BaseModel):
    """Public user information returned in responses."""
    id: int
    email: EmailStr

    class Config:
        orm_mode = True


class AuthResponse(BaseModel):
    """Response returned after successful authentication."""
    access_token: str
    token_type: str
    user: UserRead


class Organizer(BaseModel):
    """Organizer account linked to a user."""
    id: int
    user_id: int

    class Config:
        orm_mode = True


class EventCreate(BaseModel):
    """Payload for creating a new event."""
    title: str
    description: str
    date: datetime
    location: str


class Event(BaseModel):
    """Event details returned from the API."""
    id: int
    title: str
    description: str
    date: datetime
    location: str
    organizer_id: int

    class Config:
        orm_mode = True


class EventWithSales(Event):
    """Event details including ticket sales."""
    ticket_sales: int


class Ticket(BaseModel):
    """Ticket purchased by a user for an event."""
    id: int
    event_id: int
    user_id: int

    class Config:
        orm_mode = True


class SignupCreate(BaseModel):
    """Simple signup form submission."""
    first_name: str
    last_name: str
    phone: str


class SignupRead(SignupCreate):
    """Signup information returned from the API."""
    id: int

    class Config:
        orm_mode = True
