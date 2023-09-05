from pydantic import BaseModel

class Document(BaseModel):
    id:str #From s3 bucket
    text:str
    department:str