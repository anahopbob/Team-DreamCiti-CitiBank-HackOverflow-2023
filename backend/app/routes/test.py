from fastapi import APIRouter, Depends
router = APIRouter()

@router.get("/testUser")
def test_user():
    return "user_id"