from datetime import datetime
from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserRead(BaseModel):
    id: int
    email: EmailStr

    class Config:
        orm_mode = True


class AuthResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserRead


class Organizer(BaseModel):
    id: int
    user_id: int

    class Config:
        orm_mode = True


class EventCreate(BaseModel):
    title: str
    description: str
    date: datetime
    location: str


class Event(BaseModel):
    id: int
    title: str
    description: str
    date: datetime
    location: str
    organizer_id: int

    class Config:
        orm_mode = True


class EventWithSales(Event):
    ticket_sales: int


class Ticket(BaseModel):
    id: int
    event_id: int
    user_id: int

    class Config:
        orm_mode = True

