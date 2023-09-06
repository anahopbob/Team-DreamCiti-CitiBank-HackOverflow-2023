from pydantic import BaseModel
from typing import List

class FastAPI_ObjectInfo(BaseModel):
    ObjectID: str
    ObjectName: str
    Upvotes: int
    Downvotes: int
    isLink: bool
    URL: str

class FastAPI_ObjectExcerptPairs(BaseModel):
    ObjectID: str
    ExcerptIDs: List[str]