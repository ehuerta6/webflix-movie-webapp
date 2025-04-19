# Webflix Firebase Integration Guide

This guide provides step-by-step instructions to integrate Firebase services into the Webflix movie application, enabling authentication, user data storage, and favorites/watchlist functionality.

## Table of Contents

1. [Firebase Setup](#firebase-setup)
2. [Installation](#installation)
3. [Firebase Configuration](#firebase-configuration)
4. [Authentication Implementation](#authentication-implementation)
5. [Firestore Database Structure](#firestore-database-structure)
6. [Implementing User Features](#implementing-user-features)
7. [Deployment](#deployment)

## Firebase Setup

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the setup wizard
3. Name your project (e.g., "webflix-app")
4. Enable Google Analytics (optional but recommended)
5. Create the project

### Enable Authentication

1. In the Firebase Console, navigate to "Authentication"
2. Click "Get started"
3. Enable the following sign-in methods:
   - Email/Password
   - Google (recommended)
   - Anonymous (optional, for guest sessions)
4. Configure OAuth consent screen if prompted

### Set up Firestore Database

1. Navigate to "Firestore Database"
2. Click "Create database"
3. Choose "Start in production mode"
4. Select a database location closest to your target audience
5. Click "Enable"

## Installation

Add Firebase SDK to your project:

```bash
cd webflix-movie-webapp/frontend
npm install firebase
```

## Firebase Configuration

1. In Firebase Console, go to Project Settings
2. Under "Your apps", click the web icon (</>) to register a web app
3. Register the app with nickname "Webflix Web"
4. Copy the Firebase configuration object

Create a new file at `frontend/src/services/firebase.js`:

```javascript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Replace with your Firebase configuration
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'your-project-id.firebaseapp.com',
  projectId: 'your-project-id',
  storageBucket: 'your-project-id.appspot.com',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
  measurementId: 'YOUR_MEASUREMENT_ID',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
```

## Authentication Implementation

### Create AuthContext

Create `frontend/src/contexts/AuthContext.jsx`:

```jsx
import { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  async function signup(email, password, displayName) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update profile with display name
      await updateProfile(userCredential.user, { displayName });

      // Create user document in Firestore
      await createUserDocument(userCredential.user);

      return userCredential;
    } catch (error) {
      throw error;
    }
  }

  async function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  async function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);

      // Check if this is a new user
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      if (!userDoc.exists()) {
        await createUserDocument(result.user);
      }

      return result;
    } catch (error) {
      throw error;
    }
  }

  function logout() {
    return signOut(auth);
  }

  async function createUserDocument(user) {
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      const { displayName, email, uid } = user;

      try {
        await setDoc(userRef, {
          uid,
          displayName: displayName || 'Webflix User',
          email,
          createdAt: serverTimestamp(),
          settings: {
            notifications: true,
            darkMode: true,
          },
          watchlist: [],
          favorites: [],
        });
      } catch (error) {
        console.error('Error creating user document:', error);
      }
    }
  }

  async function fetchUserProfile() {
    if (!currentUser) return null;

    try {
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserProfile(userData);
        return userData;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setLoading(false);

      if (user) {
        await fetchUserProfile();
      } else {
        setUserProfile(null);
      }
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    signup,
    login,
    loginWithGoogle,
    logout,
    fetchUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
```

### Integrate AuthProvider in the App

Update `frontend/src/App.jsx` or `frontend/src/main.jsx` to wrap the application with AuthProvider:

```jsx
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return <AuthProvider>{/* Your existing app components */}</AuthProvider>;
}
```

## Firestore Database Structure

### Users Collection

```
users/
  ├── {userId}/
  │     ├── uid: string                 // Firebase auth user ID
  │     ├── displayName: string         // User's display name
  │     ├── email: string               // User's email address
  │     ├── createdAt: timestamp        // When the account was created
  │     │
  │     ├── watchlist: [                // Movies/shows the user wants to watch
  │     │     {
  │     │         id: number,           // TMDB ID of the movie/show
  │     │         type: string,         // "movie" or "tv"
  │     │         title: string,        // Title of the movie/show
  │     │         poster: string,       // URL to poster image
  │     │         backdrop: string,     // URL to backdrop image (optional)
  │     │         rating: string,       // Rating (e.g., "8.5")
  │     │         year: string,         // Release year
  │     │         addedAt: timestamp    // When the item was added to watchlist
  │     │     }
  │     │   ]
  │     │
  │     └── favorites: [                // User's favorite movies/shows
  │           {
  │               id: number,           // TMDB ID of the movie/show
  │               type: string,         // "movie" or "tv"
  │               title: string,        // Title of the movie/show
  │               poster: string,       // URL to poster image
  │               backdrop: string,     // URL to backdrop image (optional)
  │               rating: string,       // Rating (e.g., "8.5")
  │               year: string,         // Release year
  │               addedAt: timestamp    // When the item was added to favorites
  │           }
  │         ]
```

## Implementing User Features

### User Profile Component

Create `frontend/src/components/Profile.jsx`:

```jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

function Profile() {
  const { currentUser, userProfile, logout } = useAuth();

  if (!currentUser) {
    return <div>Please login to view your profile</div>;
  }

  return (
    <div className='min-h-screen bg-[#121212] text-white p-4 md:p-8'>
      <div className='max-w-3xl mx-auto'>
        <h1 className='text-2xl md:text-3xl font-bold mb-6'>Your Profile</h1>

        <div className='bg-[#1a1a1a] rounded-lg p-6 mb-8'>
          <div className='mb-6'>
            <h2 className='text-xl font-bold'>{userProfile?.displayName}</h2>
            <p className='text-gray-400'>{currentUser.email}</p>
          </div>

          <div className='flex gap-4'>
            <button
              className='px-4 py-2 bg-[#5ccfee] text-black rounded hover:bg-[#4abfe0] transition-colors'
              onClick={() => {
                /* Edit profile logic */
              }}
            >
              Edit Profile
            </button>

            <button
              className='px-4 py-2 bg-transparent border border-[#5ccfee] text-white rounded hover:bg-[#5ccfee20] transition-colors'
              onClick={logout}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Watchlist and Favorites sections would go here */}
      </div>
    </div>
  );
}

export default Profile;
```

### Watchlist/Favorites Service

Create `frontend/src/services/userMedia.js`:

```javascript
import { db } from './firebase';
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';

// Add item to watchlist
export async function addToWatchlist(userId, media) {
  if (!userId) return;

  const userRef = doc(db, 'users', userId);

  const mediaItem = {
    id: media.id,
    type: media.type,
    title: media.title,
    poster: media.poster,
    addedAt: serverTimestamp(),
  };

  try {
    await updateDoc(userRef, {
      watchlist: arrayUnion(mediaItem),
    });
    return true;
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    return false;
  }
}

// Remove item from watchlist
export async function removeFromWatchlist(userId, mediaId) {
  if (!userId) return;

  const userRef = doc(db, 'users', userId);

  try {
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) return false;

    const userData = userDoc.data();
    const itemToRemove = userData.watchlist.find((item) => item.id === mediaId);

    if (itemToRemove) {
      await updateDoc(userRef, {
        watchlist: arrayRemove(itemToRemove),
      });
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    return false;
  }
}

// Similar functions for favorites
export async function addToFavorites(userId, media) {
  // Similar implementation as addToWatchlist
}

export async function removeFromFavorites(userId, mediaId) {
  // Similar implementation as removeFromWatchlist
}
```

### Authentication Pages

Create login and signup components in `frontend/src/pages/`:

#### Login.jsx

```jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      await login(email, password);
      navigate('/');
    } catch (error) {
      setError('Failed to sign in: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setError('');

    try {
      setLoading(true);
      await loginWithGoogle();
      navigate('/');
    } catch (error) {
      setError('Failed to sign in with Google: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='min-h-screen bg-[#121212] flex items-center justify-center p-4'>
      <div className='bg-[#1a1a1a] p-8 rounded-lg max-w-md w-full'>
        <h1 className='text-2xl font-bold text-white mb-6'>Login to Webflix</h1>

        {error && (
          <div className='bg-red-500/20 text-red-200 p-3 rounded mb-4'>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-gray-300 mb-1'>Email</label>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className='w-full bg-[#252525] text-white p-2 rounded focus:outline-none focus:ring-1 focus:ring-[#5ccfee]'
            />
          </div>

          <div>
            <label className='block text-gray-300 mb-1'>Password</label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className='w-full bg-[#252525] text-white p-2 rounded focus:outline-none focus:ring-1 focus:ring-[#5ccfee]'
            />
          </div>

          <button
            type='submit'
            disabled={loading}
            className='w-full bg-[#5ccfee] text-black font-medium py-2 rounded hover:bg-[#4abfe0] transition-colors disabled:opacity-50'
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className='my-4 flex items-center'>
          <div className='flex-grow h-px bg-gray-700'></div>
          <span className='px-3 text-gray-500'>or</span>
          <div className='flex-grow h-px bg-gray-700'></div>
        </div>

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className='w-full bg-white text-black font-medium py-2 rounded hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50'
        >
          <svg viewBox='0 0 24 24' width='20' height='20'>
            {/* Google logo SVG */}
            <path
              d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
              fill='#4285F4'
            />
            <path
              d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
              fill='#34A853'
            />
            <path
              d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
              fill='#FBBC05'
            />
            <path
              d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
              fill='#EA4335'
            />
          </svg>
          Continue with Google
        </button>

        <div className='mt-6 text-center text-gray-400'>
          Don't have an account?{' '}
          <Link to='/signup' className='text-[#5ccfee] hover:underline'>
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
```

#### Signup.jsx (similar to Login.jsx with appropriate modifications)

### Add Protected Routes

Create a ProtectedRoute component to secure routes:

```jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    return <Navigate to='/login' />;
  }

  return children;
}

export default ProtectedRoute;
```

Update your router configuration to use the ProtectedRoute:

```jsx
// In your router configuration
<Routes>
  {/* Public routes */}
  <Route path='/' element={<Home />} />
  <Route path='/search' element={<SearchPage />} />
  <Route path='/movie/:id' element={<MovieDetail />} />
  <Route path='/tv/:id' element={<TVShowDetail />} />
  <Route path='/login' element={<Login />} />
  <Route path='/signup' element={<Signup />} />

  {/* Protected routes */}
  <Route
    path='/profile'
    element={
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    }
  />
  <Route
    path='/watchlist'
    element={
      <ProtectedRoute>
        <Watchlist />
      </ProtectedRoute>
    }
  />
</Routes>
```

## Deployment

1. Set up Firebase hosting:

```bash
npm install -g firebase-tools
firebase login
cd webflix-movie-webapp
firebase init
```

2. Select the following options during setup:

   - Select "Hosting"
   - Select your Firebase project
   - Set "frontend/dist" as the public directory (assuming you're using Vite)
   - Configure as a single-page app (Yes)
   - Set up automatic builds and deploys with GitHub (optional)

3. Build your project:

```bash
cd frontend
npm run build
```

4. Deploy to Firebase:

```bash
firebase deploy
```

## Security Rules

Update your Firestore security rules in the Firebase Console:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read/write only their own data
    match /users/{userId} {
      allow create: if request.auth != null;
      allow read, update, delete: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Additional Considerations

1. **Error Handling**: Implement proper error handling throughout the application
2. **Offline Support**: Configure Firestore for offline capabilities
3. **User Data Persistence**: Consider using localStorage or IndexedDB for caching user data
4. **Testing**: Write tests for authentication and Firestore operations
5. **Analytics**: Implement Firebase Analytics to track user behavior

## Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase React Hooks](https://github.com/CSFrequency/react-firebase-hooks)
- [Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Authentication](https://firebase.google.com/docs/auth)

### Header Component with Profile Link

Create or update `frontend/src/components/Header.jsx`:

```jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Header() {
  const { currentUser, logout } = useAuth();

  return (
    <header className='bg-[#121212] border-b border-[#2a2a2a] px-4 py-3'>
      <div className='max-w-7xl mx-auto flex justify-between items-center'>
        {/* Logo */}
        <Link to='/' className='text-2xl font-bold text-white'>
          <span className='text-[#5ccfee]'>Web</span>flix
        </Link>

        {/* Navigation */}
        <nav className='flex items-center space-x-6'>
          <Link to='/' className='text-gray-300 hover:text-white'>
            Home
          </Link>
          <Link to='/search' className='text-gray-300 hover:text-white'>
            Search
          </Link>
          {currentUser ? (
            <>
              <Link to='/watchlist' className='text-gray-300 hover:text-white'>
                Watchlist
              </Link>
              <div className='relative group'>
                <Link to='/profile' className='text-gray-300 hover:text-white'>
                  Profile
                </Link>
                <div className='absolute right-0 mt-2 w-48 bg-[#1a1a1a] rounded shadow-lg py-2 z-10 hidden group-hover:block'>
                  <div className='px-4 py-2 text-sm text-gray-400'>
                    {currentUser.email}
                  </div>
                  <Link
                    to='/profile'
                    className='block px-4 py-2 text-sm text-gray-300 hover:bg-[#2a2a2a]'
                  >
                    Your Profile
                  </Link>
                  <Link
                    to='/watchlist'
                    className='block px-4 py-2 text-sm text-gray-300 hover:bg-[#2a2a2a]'
                  >
                    Your Watchlist
                  </Link>
                  <button
                    onClick={logout}
                    className='block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#2a2a2a]'
                  >
                    Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <Link
              to='/login'
              className='bg-[#5ccfee] text-black px-4 py-1 rounded hover:bg-[#4abfe0] transition-colors'
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
```
