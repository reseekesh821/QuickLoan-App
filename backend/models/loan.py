from sqlalchemy import Column, Integer, String, Boolean
from database import Base

 # EXISTING LOAN MODEL
class Loan(Base):
    __tablename__ = "loans"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True)
    amount = Column(Integer)
    purpose = Column(String)
    status = Column(String, default="Pending")

# USER MODEL (For Login) ---
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True) # e.g., "admin"
    hashed_password = Column(String) # Scrambled password