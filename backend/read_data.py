from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
# Import own model 
from models.loan import Loan

# Connect to the database file
DATABASE_URL = "sqlite:///./loans.db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
db = SessionLocal()

# Get all loans
loans = db.query(Loan).all()

print("\n" + "="*40)
print(f"   DATABASE REPORT: {len(loans)} APPLICATIONS FOUND")
print("="*40)

for loan in loans:
    print(f"ID: {loan.id}")
    print(f"Name:   {loan.full_name}")
    print(f"Amount: ${loan.amount}")
    print(f"Purpose: {loan.purpose}")
    print("-" * 20)