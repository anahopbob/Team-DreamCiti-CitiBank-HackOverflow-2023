from pydantic import BaseModel

class UserBase(BaseModel):
    username: str
    email: str

class UserCreate(UserBase):
    pass

class testUser(UserBase):
    id: int

    class Config:
        orm_mode = True
