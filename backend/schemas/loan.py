from pydantic import BaseModel

# Schema for creating a Loan
class LoanCreate(BaseModel):
    full_name: str
    amount: int
    purpose: str

# NEW Schema for Logging In
class UserLogin(BaseModel):
    username: str
    password: str