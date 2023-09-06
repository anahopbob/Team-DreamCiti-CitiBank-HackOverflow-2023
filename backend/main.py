from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session  # Import Session
from app.routes import chromaDB  # Import your API route modules
from fastapi.middleware.cors import CORSMiddleware
from app.routes.relationalDatabase import initialize_rdbs, insert_dummy_data, Object_Table, ObjectVotes # Import RDBMS

# Initialize FastAPI
app = FastAPI()

# Initalize DB
def get_db_session():
    session = initialize_rdbs()
    # insert_dummy_data(session)  # You may want to call this only once when initializing the app
    try:
        yield session
    finally:
        session.close()

@app.get("/get-object/{object_id}")
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
    
# CORS (Cross-Origin Resource Sharing) configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You might want to restrict this in production
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency injection configuration
app.include_router(chromaDB.router, prefix="", tags=["chromaDB"])

# Initialize database


# Custom middleware


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
