from pydantic import BaseModel

class Document(BaseModel):
    id:str #From s3 bucket
    text:str
    department:str


class Image(BaseModel):
    id:str #From s3 bucket
    file:str
    department:str