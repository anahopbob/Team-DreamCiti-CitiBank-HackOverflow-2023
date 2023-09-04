# Team-DreamCiti-CitiBank-HackOverflow-2023

## Backend setup
```
# navigate to backend folder
cd backend
# install python virtual environment
python -m venv venv
# activate python virtual environment
venv\Scripts\activate
# install necessary FastAPI dependencies (to be changed to requirements.txt if needed)
pip install "FastAPI[all]"
# run the local backend server using uvicorn (ASGI Web Server Implementation)
uvicorn app:app --reload
```

```
pip install chromadb
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
