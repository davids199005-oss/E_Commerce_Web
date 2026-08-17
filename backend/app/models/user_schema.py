from datetime import datetime

from pydantic import BaseModel, EmailStr, Field

# Pydantic model for user creation
class UserCreate(BaseModel):
    first_name: str = Field(min_length=1, max_length=100)
    last_name: str = Field(min_length=1, max_length=100)
    email: EmailStr = Field(min_length=1, max_length=255)
    phone: str = Field(min_length=1, max_length=50)
    country: str = Field(min_length=1, max_length=100)
    city: str = Field(min_length=1, max_length=100)
    username: str = Field(min_length=1, max_length=100)
    password: str = Field(min_length=8, max_length=72)


# Pydantic model for user record
class User(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: str
    phone: str
    country: str
    city: str
    username: str
    created_at: datetime


# Pydantic model for user login
class UserLogin(BaseModel):
    username: str
    password: str
