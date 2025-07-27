from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware

from . import models, schemas, auth, database

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


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(database.get_db)):
    payload = auth.decode_access_token(token)
    if payload is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    user_id = int(payload.get("sub"))
    user = db.query(models.User).get(user_id)
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user


def get_current_organizer(current_user: models.User = Depends(get_current_user), db: Session = Depends(database.get_db)):
    organizer = db.query(models.Organizer).filter(models.Organizer.user_id == current_user.id).first()
    if not organizer:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Organizer access required")
    return organizer

@app.post("/auth/signup", response_model=schemas.AuthResponse)
def signup(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    existing = db.query(models.User).filter(models.User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    
    user_obj = models.User(
        email=user.email,
        username=user.username,
        password_hash=auth.get_password_hash(user.password)
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
            "username": user_obj.username
        }
    }

@app.post("/auth/login", response_model=schemas.AuthResponse)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password")
    
    access_token = auth.create_access_token({"sub": str(user.id)})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": str(user.id),
            "email": user.email,
            "username": user.username
        }
    }

@app.get("/me", response_model=schemas.UserRead)
def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user

@app.get("/events", response_model=list[schemas.Event])
def get_events(current_user: models.User = Depends(get_current_user), db: Session = Depends(database.get_db)):
    return db.query(models.Event).all()


@app.post("/events", response_model=schemas.Event)
def create_event(event: schemas.EventCreate, organizer: models.Organizer = Depends(get_current_organizer), db: Session = Depends(database.get_db)):
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
    return event_obj


@app.post("/events/{event_id}/tickets", response_model=schemas.Ticket)
def purchase_ticket(event_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(database.get_db)):
    event = db.query(models.Event).get(event_id)
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")
    ticket = models.Ticket(event_id=event_id, user_id=current_user.id)
    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    return ticket

