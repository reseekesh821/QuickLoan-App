QuickLoan Application

    A full-stack loan management system that allows users to apply for loans and administrators to manage applications.

Project Overview

This project consists of two parts:

    1.Frontend: A React application where users fill out forms and admins manage data.

    2.Backend: A FastAPI (Python) server that handles the database, logic, and authentication.

Features

For Users:

    # Application Form: Simple form to submit Name, Loan Amount, and Purpose.

    # Submission Handling: Connects to the API to save data immediately.

For Admins:

    # Secure Login: Uses username/password authentication to access the dashboard.

    # Dashboard View: Displays a list of all loan applications in a table.

    # Status Management: Buttons to "Approve" or "Reject" applications.

    # Edit & Delete: Update loan details or remove applications from the database.

    # Search & Filter: Filter the list by status (Pending, Approved, Rejected) or search by name.

Technologies Used:

    # Frontend: React (Vite), Tailwind CSS, React Router.

    # Backend: Python, FastAPI, SQLAlchemy (Database ORM).

    # Database: SQLite (Stored locally as loans.db).

    # Security: JSON Web Tokens (JWT) for login sessions, Passlib for password hashing.

How to Run

    1. Backend Setup (The Server)

        You need to start the Python server first.

            # Open a terminal in the backend folder.

            # Create and activate a virtual environment (optional but recommended):

                python -m venv venv

                # Windows:

                .\venv\Scripts\activate

                # Mac/Linux:

                source venv/bin/activate

            # Install the required libraries:

                pip install fastapi uvicorn sqlalchemy python-jose[cryptography] passlib[bcrypt]

            # Start the server:

                uvicorn main:app --reload --port 8001

                The server is now running at http://127.0.0.1:8001.

    2. Frontend Setup (The Interface)

        Leave the backend terminal running and open a new terminal window.

            # Navigate to the frontend folder.

            # Install the dependencies:

                npm install

            # Start the application:

                npm run dev

                The application is now running at http://localhost:5173.

    3. Using the App

        # Go to http://localhost:5173 in your browser.

        # To Apply: Fill out the form on the home page.

        # To Administer: Click "Dashboard" in the top right. You will be redirected to Login.

            Note: You must create an admin user via the backend API or script first to log in.