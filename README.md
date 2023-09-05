# Team-DreamCiti-CitiBank-HackOverflow-2023

## Backend setup

### 1.navigate to backend folder
```
cd backend
```
### 2.install python virtual environment
```
python -m venv venv
```
### 3.activate python virtual environment
```
venv\Scripts\activate
```
#### for Linux/MacOS
```
source venv/bin/activate
```
### 4.install necessary dependencies
```
pip install -r requirements.txt
```

### 5.run the local backend server using uvicorn (ASGI Web Server Implementation)
```
uvicorn main:app --reload
```
### 6.access the FastAPI app root page
```
http://127.0.0.1:8000
```
### 7.access the SwaggerUI API Documentation
```
http://127.0.0.1:8000/docs
```

## Frontend setup

### 1.navigate to frontend folder
```
cd frontend
```
### 2.install necessary dependencies
```
npm i
```
### 3.run the local frontend server
```
npm run dev
```
