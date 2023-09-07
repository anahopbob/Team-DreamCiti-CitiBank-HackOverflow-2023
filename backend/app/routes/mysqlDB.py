from fastapi import APIRouter, Depends
from app.services.relationalDatabase import initialize_rdbs, ObjectInfo, ObjectExcerptPair
from sqlalchemy.orm import Session  # Import Session
from typing import List
# from app.routes.chromaDB import delete_object_from_chromadb
from app.models.FastAPI_MySQL_Objects import FastAPI_ObjectInfo, FastAPI_ObjectExcerptPairs

router = APIRouter()


import chromadb

client = chromadb.PersistentClient(
    path="db/chroma.db"
)   
collection = client.get_or_create_collection(
    name="documents",
    metadata={"hnsw:space": "cosine"}
)

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
    
@router.get("/getUrl")
def get_object_info(
    object_id: str,
    session: Session = Depends(get_db_session)
):
    """
    Get a particular object info from the database.
    """
    try:
        object_info = session.query(ObjectInfo).filter(ObjectInfo.ObjectName == object_id).first()
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
        object_excerpt_pairs = session.query(ObjectExcerptPair).filter(ObjectExcerptPair.ObjectID == object_id).all()
        session.close()
        return object_excerpt_pairs
    except Exception as e:
        return {
            "message": "Object excerpt pairs retrieval failed",
            "error": str(e)
        }
    
@router.get("/objectInfo/all")
def get_all_object_info(
    session: Session = Depends(get_db_session)
):
    """
    Get all object info from the database.
    """
    try:
        object_info = session.query(ObjectInfo).all()
        session.close()
        return object_info
    except Exception as e:
        return {
            "message": "Object info retrieval failed",
            "error": str(e)
        }
    
@router.put("/upvote/{object_id}")
def upvote_object(
    object_id: str,
    session: Session = Depends(get_db_session)
):
    """
    Upvote an object
    """
    try:
        object_info = session.query(ObjectInfo).filter(ObjectInfo.ObjectID == object_id).first()
        object_info.Upvotes += 1
        session.commit()
        session.close()
        return {"message": "Object upvoted"}
    except Exception as e:
        return {
            "message": "Object upvote failed",
            "error": str(e)
        }
    
@router.put("/downvote/{object_id}")
def downvote_object(
    object_id: str,
    session: Session = Depends(get_db_session)
):
    """
    Downvote an object
    """
    try:
        object_info = session.query(ObjectInfo).filter(ObjectInfo.ObjectID == object_id).first()
        object_info.Downvotes += 1
        session.commit()
        session.close()
        return {"message": "Object downvoted"}
    except Exception as e:
        return {
            "message": "Object downvote failed",
            "error": str(e)
        }


# @router.post("/objectInfo")
def insert_object_info(
    object_info: dict,
    session: Session = Depends(get_db_session)
):
    """
    Insert a single object info into the database.
    """
    try:
        object_info_entry = ObjectInfo(
            ObjectID=object_info["ObjectID"],
            ObjectName=object_info["ObjectName"],
            Upvotes=object_info["Upvotes"],
            Downvotes=object_info["Downvotes"],
            Department=object_info["Department"],
            Classification=object_info["Classification"],
            isLink=object_info["isLink"],
            URL=object_info["URL"]
        )
        session = get_db_session()    
        session = next(session)
        session.add(object_info_entry)
        session.commit()
        # session.close()
        return {"message": "Object info successfully inserted"}
    except Exception as e:
        return {
            "message": "Object info insertion failed",
            "error": str(e)
        }


# @router.post("/objectExcerptPairs")
def insert_object_excerpt_pairs(
    id,
    excerpt_ids,
    # pairings: FastAPI_ObjectExcerptPairs,
    session: Session = Depends(get_db_session)
):
    """
    Refactored to be called by chromaDB.py
    """
    try:
        pairs = []
        for pair in excerpt_ids:
            # Create a new object excerpt pair
            object_excerpt_pair = ObjectExcerptPair(
                ObjectID=id,
                ExcerptID=pair
            )
            pairs.append(object_excerpt_pair)
        session = get_db_session()    
        session = next(session)

        session.add_all(pairs)
        session.commit()
        session.close()
        return True
    except Exception as e:
        return False
    # return {
        #     "message": "Object excerpt pairs insertion failed",
        #     "error": str(e)
        # }

@router.delete("/delete_object/{object_id}")
def delete_object(
    object_id: str,
    session: Session = Depends(get_db_session)
):
    """
    This deletion DOES NOT delete from the S3 bucket. The process for deletion is as follows
        1. Retrieve all associated excerpts from MySQLDB.
        2. Pass excerpts to chromaDB for deletion.
        3. Delete exerpts from MySQLDB.
        4. Delete object from MySQLDB.
    """
    association_list = helper_get_object_excerpt_pairs(object_id, session)
    no_of_deleted_excerpts = delete_object_from_chromadb(association_list)
    true1 = helper_delete_object_excerpt_pairs(object_id, session)
    true2 = helper_delete_object_info(object_id, session)
    if true1 and true2:
        session.commit()
        session.close()
        return {"message": f"Object successfully deleted, {no_of_deleted_excerpts} excerpts deleted!"}
    session.close()
    return {"message": "Object deletion failed."}

# === Start of Helper for Delete Function ===

def helper_get_object_excerpt_pairs(
    object_id: str,
    session: Session = Depends(get_db_session)
):
    """
    Get a particular object excerpt pair from the database.
    This does NOT close the connection
    """
    try:
        object_excerpt_pairs = session.query(ObjectExcerptPair).filter(ObjectExcerptPair.ObjectID == object_id).all()
        return object_excerpt_pairs
    except Exception as e:
        return {
            "message": "Object excerpt pairs retrieval failed",
            "error": str(e)
        }
    
def helper_delete_object_excerpt_pairs(
        object_id:str,
        session: Session = Depends(get_db_session)
):
    """
    Delete all object excerpt pairs from the database with matching id.
    This does not CLOSE the connection
    """
    try:
        session.query(ObjectExcerptPair).filter(ObjectExcerptPair.ObjectID == object_id).delete()
        return True
    except Exception as e:
        return False
    
def helper_delete_object_info(
        object_id:str,
        session: Session = Depends(get_db_session)
):
    """
    Delete the object info from the ObjectInfo with matching id.
    This does not CLOSE the connection
    """
    try:
        session.query(ObjectInfo).filter(ObjectInfo.ObjectID == object_id).delete()
        return True
    except Exception as e:
        return False
    
def delete_object_from_chromadb(
        object_excerpt_list: List[dict]
    ):
    """
    THIS ROUTE HAS BEEN REFACTORED TO BE USED IN mysqlDB.py.
    IT WILL NOT BE CALLED FROM THE ROUTER ABOVE.
    Given an object_id that corrosponds to the one inside S3,
    delete all related embeddings inside ChromaDB.
    Currently, association is hard coded.
    """
    # Connect to  bucket to get association list 
    if len(object_excerpt_list) == 0:
        return []
    try:
        association = []
        for pair in object_excerpt_list:
            association.append(pair.ExcerptID)
        collection.delete(
            ids=association
        )
        return len(association)
    except Exception as e:
        print("Error in deleting from ChromaDB")
        print(e)
        return None
    
# === End of Helper for Delete Function ===
