"""Main FastAPI application with API endpoints."""

from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware

from . import models, schemas, auth, database, tasks, matching

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3412", "http://localhost:19006"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


def get_current_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(database.get_db)
):
    """Return the authenticated user based on the provided JWT token."""

    payload = auth.decode_access_token(token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token"
        )
    user_id = int(payload.get("sub"))
    user = db.query(models.User).get(user_id)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )
    return user


def get_current_organizer(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(database.get_db),
):
    """Ensure the current user is an organizer and return the organizer record."""

    organizer = (
        db.query(models.Organizer)
        .filter(models.Organizer.user_id == current_user.id)
        .first()
    )
    if not organizer:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Organizer access required"
        )
    return organizer


@app.post("/auth/signup", response_model=schemas.AuthResponse)
def signup(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    """Register a new user and return an access token."""
    existing = db.query(models.User).filter(models.User.email == user.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered"
        )

    user_obj = models.User(
        email=user.email,
        username=user.username,
        password_hash=auth.get_password_hash(user.password),
    )
    db.add(user_obj)
    db.commit()
    db.refresh(user_obj)

    access_token = auth.create_access_token({"sub": str(user_obj.id)})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": str(user_obj.id),
            "email": user_obj.email,
            "username": user_obj.username,
        },
    }


@app.post("/auth/login", response_model=schemas.AuthResponse)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(database.get_db),
):
    """Authenticate a user and return a JWT access token."""
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )

    access_token = auth.create_access_token({"sub": str(user.id)})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {"id": str(user.id), "email": user.email, "username": user.username},
    }


@app.get("/me", response_model=schemas.UserRead)
def read_users_me(current_user: models.User = Depends(get_current_user)):
    """Return information about the current authenticated user."""
    return current_user


@app.get("/events", response_model=list[schemas.Event])
def get_events(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(database.get_db),
):
    """List all events."""
    return db.query(models.Event).all()


@app.get("/events/{event_id}", response_model=schemas.Event)
def get_event(
    event_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(database.get_db),
):
    """Retrieve details for a single event."""
    event = db.query(models.Event).get(event_id)
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Event not found"
        )
    return event


@app.post("/events", response_model=schemas.Event)
def create_event(
    event: schemas.EventCreate,
    organizer: models.Organizer = Depends(get_current_organizer),
    db: Session = Depends(database.get_db),
):
    """Create a new event owned by the authenticated organizer."""
    event_obj = models.Event(
        title=event.title,
        description=event.description,
        date=event.date,
        location=event.location,
        organizer_id=organizer.id,
    )
    db.add(event_obj)
    db.commit()
    db.refresh(event_obj)
    # Enqueue background matching task
    tasks.enqueue_match_event(event_obj.id)
    return event_obj


@app.get("/organizer/events", response_model=list[schemas.EventWithSales])
def get_organizer_events(
    organizer: models.Organizer = Depends(get_current_organizer),
    db: Session = Depends(database.get_db),
):
    """Return all events created by the current organizer with ticket sales."""
    events = (
        db.query(models.Event).filter(models.Event.organizer_id == organizer.id).all()
    )
    results = []
    for event in events:
        sales = (
            db.query(func.count(models.Ticket.id))
            .filter(models.Ticket.event_id == event.id)
            .scalar()
        )
        results.append(
            {
                "id": event.id,
                "title": event.title,
                "description": event.description,
                "date": event.date,
                "location": event.location,
                "organizer_id": event.organizer_id,
                "ticket_sales": sales or 0,
            }
        )
    return results


@app.get("/organizer/events/{event_id}/tickets", response_model=list[schemas.Ticket])
def get_event_tickets(
    event_id: int,
    organizer: models.Organizer = Depends(get_current_organizer),
    db: Session = Depends(database.get_db),
):
    """List tickets sold for a specific event."""
    event = (
        db.query(models.Event)
        .filter(models.Event.id == event_id, models.Event.organizer_id == organizer.id)
        .first()
    )
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Event not found"
        )
    return db.query(models.Ticket).filter(models.Ticket.event_id == event_id).all()


@app.post("/events/{event_id}/tickets", response_model=schemas.Ticket)
def purchase_ticket(
    event_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(database.get_db),
):
    """Purchase a ticket for an event."""
    event = db.query(models.Event).get(event_id)
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Event not found"
        )
    ticket = models.Ticket(event_id=event_id, user_id=current_user.id)
    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    return ticket


@app.post("/signup", response_model=schemas.SignupRead)
def create_signup(info: schemas.SignupCreate, db: Session = Depends(database.get_db)):
    """Store a simple signup record."""
    signup = models.Signup(
        first_name=info.first_name, last_name=info.last_name, phone=info.phone
    )
    db.add(signup)
    db.commit()
    db.refresh(signup)
    return signup


@app.post("/match/{event_id}")
def match_event(
    event_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(database.get_db),
):
    """Generate embeddings for a user and event and store them in Pinecone."""
    event = db.query(models.Event).get(event_id)
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Event not found"
        )

    user_emb = matching.generate_user_embedding(current_user)
    event_emb = matching.generate_event_embedding(event)

    matching.store_user_embedding(current_user.id, user_emb)
    matching.store_event_embedding(event.id, event_emb)

    return {"detail": "Embeddings stored"}
