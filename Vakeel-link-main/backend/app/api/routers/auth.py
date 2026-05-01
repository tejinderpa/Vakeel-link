from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from typing import Optional
from app.services.auth_service import AuthService
from app.models.user import UserCreate

router = APIRouter()
auth_service = AuthService()

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class SignupRequest(UserCreate):
    # Additional fields specific to our React Frontend forms
    bar_council_id: Optional[str] = None
    experience_years: Optional[int] = None

@router.post("/signup")
def signup(request: SignupRequest):
    """
    Register a new user. 
    If the role is 'lawyer', the bar_council_id must be provided.
    """
    if request.role == 'lawyer' and not request.bar_council_id:
        raise HTTPException(status_code=400, detail="Lawyers must provide a valid Bar Council ID.")
        
    return auth_service.signup_user(request.model_dump())

@router.post("/login")
def login(request: LoginRequest):
    """
    Authenticate and retrieve a JWT token and user role.
    """
    return auth_service.login_user(request.email, request.password)
