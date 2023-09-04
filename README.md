# Team-DreamCiti-CitiBank-HackOverflow-2023

## Backend setup
```
# navigate to backend folder
cd backend

# install python virtual environment
python -m venv venv

# activate python virtual environment
venv\Scripts\activate

# install necessary dependencies
pip install -r requirements.txt

# run the local backend server using uvicorn (ASGI Web Server Implementation)
uvicorn app:app --reload

# access the FastAPI app root page
http://127.0.0.1:8000

# access the SwaggerUI API Documentation
http://127.0.0.1:8000/docs
```

## Frontend setup
```
# navigate to frontend folder
cd frontend

# install necessary dependencies
npm i

# run the local frontend server
npm run dev
```
