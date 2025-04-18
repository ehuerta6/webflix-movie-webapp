# Webflix - API Implementation Guide

## 🔌 Frontend API Integration

### 1. Setting Up TMDB API

1. **Create TMDB Account**:

   - Register at [themoviedb.org](https://www.themoviedb.org/)
   - Request an API key from your account dashboard

2. **Environment Configuration**:

   - Create `.env` file in the frontend directory:

   ```
   VITE_TMDB_API_KEY=your_api_key_here
   VITE_API_BASE_URL=https://api.themoviedb.org/3
   ```

3. **Create API Service**:

   - Create `src/services/api.js`:

   ```javascript
   const API_KEY = import.meta.env.VITE_TMDB_API_KEY
   const BASE_URL = import.meta.env.VITE_API_BASE_URL

   export const fetchTrending = async () => {
     try {
       const response = await fetch(
         `${BASE_URL}/trending/all/week?api_key=${API_KEY}`
       )
       return await response.json()
     } catch (error) {
       console.error('Error fetching trending:', error)
       return { results: [] }
     }
   }

   export const fetchMovieDetails = async (id) => {
     try {
       const response = await fetch(
         `${BASE_URL}/movie/${id}?api_key=${API_KEY}&append_to_response=credits,similar`
       )
       return await response.json()
     } catch (error) {
       console.error('Error fetching movie details:', error)
       return null
     }
   }

   // Add more API methods as needed
   ```

### 2. Frontend Component Modifications

#### Home.jsx

```javascript
import { useEffect, useState } from 'react'
import { fetchTrending } from '../services/api'

// Replace mock data with API calls:
useEffect(() => {
  const loadTrending = async () => {
    setLoading(true)
    const data = await fetchTrending()
    setMovies(data.results || [])
    setLoading(false)
  }

  loadTrending()
}, [])
```

#### Movies.jsx / Shows.jsx

```javascript
import { fetchMovies, fetchGenres } from '../services/api'

// Replace mock data generation with:
useEffect(() => {
  const loadMovies = async () => {
    setLoading(true)
    const data = await fetchMovies() // Create this method in api.js
    setMovies(data.results || [])
    setLoading(false)
  }

  const loadGenres = async () => {
    const genreData = await fetchGenres() // Create this method in api.js
    setGenres(['All', ...genreData.genres.map((g) => g.name)])
  }

  loadGenres()
  loadMovies()
}, [])
```

#### Details.jsx

```javascript
import { useParams } from 'react-router-dom'
import { fetchMovieDetails, fetchShowDetails } from '../services/api'

const { id, type } = useParams()

useEffect(() => {
  const loadDetails = async () => {
    setLoading(true)
    let data
    if (type === 'movie') {
      data = await fetchMovieDetails(id)
    } else {
      data = await fetchShowDetails(id)
    }
    setDetails(data)
    setLoading(false)
  }

  loadDetails()
}, [id, type])
```

## 🔧 Setting Up Flask Backend

### 1. Project Structure

```
webflix-movie-webapp/
├── frontend/         # React frontend
└── backend/          # Flask backend
    ├── app.py        # Main Flask application
    ├── config.py     # Configuration
    ├── models/       # Database models
    ├── routes/       # API routes
    ├── services/     # Service layer
    └── requirements.txt
```

### 2. Flask Backend Implementation

#### Installation

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install flask flask-cors python-dotenv requests flask-sqlalchemy
pip freeze > requirements.txt
```

#### Basic Flask App (app.py)

```python
from flask import Flask, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import requests

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

TMDB_API_KEY = os.environ.get('TMDB_API_KEY')
TMDB_BASE_URL = 'https://api.themoviedb.org/3'

@app.route('/api/trending')
def get_trending():
    try:
        response = requests.get(
            f'{TMDB_BASE_URL}/trending/all/week?api_key={TMDB_API_KEY}'
        )
        return jsonify(response.json())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/movies/<int:movie_id>')
def get_movie(movie_id):
    try:
        response = requests.get(
            f'{TMDB_BASE_URL}/movie/{movie_id}?api_key={TMDB_API_KEY}&append_to_response=credits,similar'
        )
        return jsonify(response.json())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Add more endpoints as needed

if __name__ == '__main__':
    app.run(debug=True)
```

#### User Authentication (.env)

```
TMDB_API_KEY=your_tmdb_api_key
JWT_SECRET=your_secret_key
```

#### User Model (models/user.py)

```python
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    bio = db.Column(db.Text)

    # Relationships for user collections
    liked_movies = db.relationship('LikedMovie', backref='user', lazy=True)
    watchlist = db.relationship('WatchlistItem', backref='user', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
```

#### Auth Routes (routes/auth.py)

```python
from flask import Blueprint, request, jsonify
import jwt
import datetime
import os
from models.user import User, db

auth = Blueprint('auth', __name__)
JWT_SECRET = os.environ.get('JWT_SECRET')

@auth.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    # Check if user exists
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already registered'}), 400

    # Create new user
    new_user = User(
        username=data['username'],
        email=data['email']
    )
    new_user.set_password(data['password'])

    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully'}), 201

@auth.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()

    if not user or not user.check_password(data['password']):
        return jsonify({'error': 'Invalid credentials'}), 401

    # Generate JWT token
    token = jwt.encode(
        {
            'user_id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1)
        },
        JWT_SECRET,
        algorithm='HS256'
    )

    return jsonify({
        'token': token,
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email
        }
    })
```

### 3. Frontend-Backend Integration

#### Update Frontend API Service

```javascript
// src/services/api.js

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

// Authentication
export const login = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    })
    return await response.json()
  } catch (error) {
    console.error('Login error:', error)
    throw error
  }
}

// API calls now go through backend
export const fetchTrending = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/trending`)
    return await response.json()
  } catch (error) {
    console.error('Error fetching trending:', error)
    return { results: [] }
  }
}
```

## 🔍 Further Considerations

### Security

- Implement proper CORS configuration
- Use environment variables for sensitive data
- JWT token validation middleware
- HTTPS in production

### User Features

- Persist user preferences
- Implement watchlist/liked movies functionality
- Add user profile management

### Deployment

- Frontend: Vercel, Netlify, or GitHub Pages
- Backend: Heroku, Railway, or Google Cloud
- Database: PostgreSQL or MongoDB Atlas
