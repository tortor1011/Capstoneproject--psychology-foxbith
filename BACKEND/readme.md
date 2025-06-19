# BACKEND - Mental Health Assessment API

This is the backend for a mental health assessment system, built with Go and MongoDB.

## Project Structure

```
BACKEND/
├── .env
├── go.mod
├── go.sum
├── cmd/
│   └── main.go
├── db/
│   └── mongo.go
├── model/
│   └── assessment.go
```

## Getting Started

1. **Install Go**  
   Download and install Go from [https://go.dev/dl/](https://go.dev/dl/)

2. **Set up MongoDB**  
   - Create a MongoDB URI and add it to the `.env` file  
   - Example `.env`:
     ```
     MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/?retryWrites=true&w=majority
     ```

3. **Install dependencies**
   ```sh
   go mod tidy
   ```

## Running the Project

```sh
go run ./cmd/main.go
```

The server will start at `http://localhost:8080`

## API Endpoints

- `POST /assessment`  
  Accepts assessment data (JSON) and saves it to the database

- `GET /assessments`  
  Retrieves all assessment records

## Notes

- Make sure you have a `.env` file with a valid `MONGODB_URI`
- To build as a binary:
  ```sh
  go build -o backend-app ./cmd/main.go
  ./backend
  ```