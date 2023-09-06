from fastapi import APIRouter, Depends
from app.services.relationalDatabase import initialize_rdbs, ObjectInfo, ObjectExcerptPair
from sqlalchemy.orm import Session  # Import Session

from app.models.FastAPI_MySQL_Objects import FastAPI_ObjectInfo, FastAPI_ObjectExcerptPairs

router = APIRouter()

def get_db_session():
    session = initialize_rdbs()
    # insert_dummy_data(session)  # You may want to call this only once when initializing the app
    try:
        yield session
    finally:
        session.close()

@router.get("/objectInfo")
def get_object_info(
    object_id: str,
    session: Session = Depends(get_db_session)
):
    """
    Get a particular object info from the database.
    """
    try:
        object_info = session.query(ObjectInfo).filter(ObjectInfo.ObjectID == object_id).first()
        session.close()
        return object_info
    except Exception as e:
        return {
            "message": "Object info retrieval failed",
            "error": str(e)
        }
    
@router.get("/objectExcerptPairs")
def get_object_excerpt_pairs(
    object_id: str,
    session: Session = Depends(get_db_session)
):
    """
    Get a particular object excerpt pair from the database.
    """
    try:
        object_excerpt_pairs = session.query(ObjectExcerptPair).filter(ObjectInfo.ObjectID == object_id).all()
        session.close()
        return object_excerpt_pairs
    except Exception as e:
        return {
            "message": "Object excerpt pairs retrieval failed",
            "error": str(e)
        }

@router.post("/objectInfo")
def insert_object_info(
    object_info: FastAPI_ObjectInfo,
    session: Session = Depends(get_db_session)
):
    """
    Insert a single object info into the database.
    """
    try:
        object_info_entry = ObjectInfo(
            ObjectID=object_info.ObjectID,
            ObjectName=object_info.ObjectName,
            Upvotes=object_info.Upvotes,
            Downvotes=object_info.Downvotes,
            isLink=object_info.isLink,
            URL=object_info.URL
        )
        session.add(object_info_entry)
        session.commit()
        session.close()
        return {"message": "Object info successfully inserted"}
    except Exception as e:
        return {
            "message": "Object info insertion failed",
            "error": str(e)
        }


@router.post("/objectExcerptPairs")
def insert_object_excerpt_pairs(
    pairings: FastAPI_ObjectExcerptPairs,
    session: Session = Depends(get_db_session)
):
    try:
        pairs = []
        for pair in pairings.ExcerptIDs:
            # Create a new object excerpt pair
            object_excerpt_pair = ObjectExcerptPair(
                ObjectID=pairings.ObjectID,
                ExcerptID=pair
            )
            pairs.append(object_excerpt_pair)
        session.add_all(pairs)
        session.commit()
        session.close()
        return {"message": "Object info successfully inserted"}
    except Exception as e:
        return {
            "message": "Object excerpt pairs insertion failed",
            "error": str(e)
        }

