from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import JWTError, jwt 

from database import engine, SessionLocal
from models import loan as loan_model
from schemas import loan as loan_schema

# CONFIGURATION 
SECRET_KEY = "mysecretkey" # Change this in production
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# Create Tables
loan_model.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Security Setup
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login") 

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# AUTH HELPER FUNCTIONS
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    user = db.query(loan_model.User).filter(loan_model.User.username == username).first()
    if user is None:
        raise credentials_exception
    return user

# ROUTES

@app.post("/create_admin")
def create_admin(user: loan_schema.UserLogin, db: Session = Depends(get_db)):
    existing_user = db.query(loan_model.User).filter(loan_model.User.username == user.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    hashed_pw = pwd_context.hash(user.password)
    new_user = loan_model.User(username=user.username, hashed_password=hashed_pw)
    db.add(new_user)
    db.commit()
    return {"message": "Admin Account Created Successfully!"}

# UPDATED LOGIN: Returns the Token!
@app.post("/login")
def login(user: loan_schema.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(loan_model.User).filter(loan_model.User.username == user.username).first()
    if not db_user or not pwd_context.verify(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    # Generate Token
    access_token = create_access_token(data={"sub": db_user.username})
    # NOTE: Matching the key 'access_token' expected by Login.jsx
    return {"access_token": access_token, "token_type": "bearer"}

# WELCOME ROUTE (Stops the buffering!)
@app.get("/")
def read_root():
    return {"message": "Server is running perfectly! Go to /docs to see the API."}

# LOAN ROUTES

# Public Route (Anyone can apply)
@app.post("/loans/apply")
def apply_for_loan(application: loan_schema.LoanCreate, db: Session = Depends(get_db)):
    new_loan = loan_model.Loan(
        full_name=application.full_name,
        amount=application.amount,
        purpose=application.purpose
    )
    db.add(new_loan)
    db.commit()
    db.refresh(new_loan)
    return {"message": "Application Saved!"}

# Protected Routes (Require for Login)
@app.get("/loans")
def get_all_loans(db: Session = Depends(get_db), current_user: loan_model.User = Depends(get_current_user)):
    return db.query(loan_model.Loan).all()

@app.put("/loans/{loan_id}/approve")
def approve_loan(loan_id: int, db: Session = Depends(get_db), current_user: loan_model.User = Depends(get_current_user)):
    loan = db.query(loan_model.Loan).filter(loan_model.Loan.id == loan_id).first()
    if not loan: raise HTTPException(status_code=404, detail="Loan not found")
    loan.status = "Approved"
    db.commit()
    return {"message": "Loan Approved!"}

@app.put("/loans/{loan_id}/reject")
def reject_loan(loan_id: int, db: Session = Depends(get_db), current_user: loan_model.User = Depends(get_current_user)):
    loan = db.query(loan_model.Loan).filter(loan_model.Loan.id == loan_id).first()
    if not loan: raise HTTPException(status_code=404, detail="Loan not found")
    loan.status = "Rejected"
    db.commit()
    return {"message": "Loan Rejected!"}

@app.delete("/loans/{loan_id}")
def delete_loan(loan_id: int, db: Session = Depends(get_db), current_user: loan_model.User = Depends(get_current_user)):
    loan = db.query(loan_model.Loan).filter(loan_model.Loan.id == loan_id).first()
    if not loan: raise HTTPException(status_code=404, detail="Loan not found")
    db.delete(loan)
    db.commit()
    return {"message": "Loan deleted"}

@app.put("/loans/{loan_id}")
def update_loan(loan_id: int, updated_loan: loan_schema.LoanCreate, db: Session = Depends(get_db), current_user: loan_model.User = Depends(get_current_user)):
    loan = db.query(loan_model.Loan).filter(loan_model.Loan.id == loan_id).first()
    if not loan: raise HTTPException(status_code=404, detail="Loan not found")
    loan.full_name = updated_loan.full_name
    loan.amount = updated_loan.amount
    loan.purpose = updated_loan.purpose
    db.commit()
    return loan