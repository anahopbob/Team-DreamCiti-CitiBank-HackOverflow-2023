from fastapi import APIRouter, Depends
from app.services.relationalDatabase import initialize_rdbs, insert_dummy_data, Object_Table, ObjectVotes # Import RDBMS
from sqlalchemy.orm import Session  # Import Session

router = APIRouter()

def get_db_session():
    session = initialize_rdbs()
    # insert_dummy_data(session)  # You may want to call this only once when initializing the app
    try:
        yield session
    finally:
        session.close()

@router.get("/get-object/{object_id}")
def get_object_by_id(
        object_id: str,
        session: Session = Depends(get_db_session)
      ):
    # Use SQLAlchemy to query the database based on the object_id
    object_data = session.query(Object_Table).filter(Object_Table.ObjectID == object_id).first()

    if object_data is None:
        # Handle the case where the object_id doesn't exist in the database
        return {"message": "Object not found"}
    return object_data