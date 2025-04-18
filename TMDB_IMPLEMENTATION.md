# Webflix TMDB API Implementation Guide

This guide outlines the steps to set up and start using the TMDB API with the Webflix application.

## Setup Steps

### 1. Add Your TMDB API Key

You need to add your TMDB API key in two places:

- **Frontend**: In `frontend/.env`

  ```
  VITE_TMDB_API_KEY=your_tmdb_api_key_here
  ```

- **Backend**: In `backend/.env`
  ```
  TMDB_API_KEY=your_tmdb_api_key_here
  ```

**Important**: Replace `your_tmdb_api_key_here` with your actual TMDB API key in both files.

### 2. Install Dependencies

#### Frontend

```bash
cd frontend
npm install
```

#### Backend

```bash
cd backend
pip install -r requirements.txt
```

### 3. Run the Application

#### Start the Backend

```bash
cd backend
flask run
# Or directly with Python:
# python app.py
```

#### Start the Frontend

```bash
cd frontend
npm run dev
```

## What's Implemented

### Frontend

1. **API Service**: `frontend/src/services/api.js`

   - Methods for fetching data from TMDB API
   - Handles errors and provides fallbacks

2. **Environment Configuration**: `frontend/.env`
   - Stores your TMDB API key securely
   - Configures the API base URL

### Backend

1. **API Proxy**: `backend/app.py`

   - Acts as a proxy to the TMDB API
   - Provides endpoints that match the frontend API service
   - Handles errors and validation

2. **Environment Configuration**: `backend/.env`
   - Securely stores your TMDB API key
   - Allows for configuration without code changes

## Next Steps

1. **Integrate with React Components**:
   - Update your components to use the API service
   - Replace mock data with API calls
2. **Add Authentication** (future enhancement):

   - Implement user registration and login
   - Add features like favorites and watchlist

3. **Enhanced Error Handling**:
   - Improve error handling and user feedback
   - Add loading states in the UI

## Testing the API

You can test if your API key is working by visiting the health check endpoint:

```
http://localhost:5000/api/health
```

This should return a success message if everything is set up correctly.
