import { createContext, useContext, useEffect, useState } from 'react'
import { auth, db } from '../firebase/firebase'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
} from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'

const AuthContext = createContext()
const googleProvider = new GoogleAuthProvider()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  // Login with email and password
  const login = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password)
  }

  // Logout
  const logout = () => {
    setUserProfile(null)
    return signOut(auth)
  }

  // Sign up with email and password
  const signup = async (email, password, displayName) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )

      // Update profile with display name
      await updateProfile(userCredential.user, { displayName })

      // Create user document in Firestore
      await createUserDocument(userCredential.user)

      return userCredential
    } catch (error) {
      console.error('Error during sign up:', error.message)
      throw error
    }
  }

  // Sign in with Google
  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)

      // Check if this is a new user
      const userDoc = await getDoc(doc(db, 'users', result.user.uid))
      if (!userDoc.exists()) {
        await createUserDocument(result.user)
      }

      return result
    } catch (error) {
      console.error('Error during Google sign in:', error.message)
      throw error
    }
  }

  // Create user document in Firestore
  const createUserDocument = async (user) => {
    if (!user) return

    const userRef = doc(db, 'users', user.uid)
    const userSnap = await getDoc(userRef)

    if (!userSnap.exists()) {
      const { displayName, email, uid } = user

      try {
        await setDoc(userRef, {
          uid,
          displayName: displayName || 'Webflix User',
          email,
          createdAt: serverTimestamp(),
          bio: 'Movie enthusiast and aspiring critic.',
          favoriteGenres: [],
          stats: {
            moviesLiked: 0,
            watchlistCount: 0,
          },
          watchlist: [],
          favorites: [],
        })
      } catch (error) {
        console.error('Error creating user document:', error)
      }
    }
  }

  // Fetch user profile from Firestore
  const fetchUserProfile = async () => {
    if (!currentUser) return null

    try {
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid))
      if (userDoc.exists()) {
        const userData = userDoc.data()
        setUserProfile(userData)
        return userData
      }
      return null
    } catch (error) {
      console.error('Error fetching user profile:', error)
      return null
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user)

      if (user) {
        await fetchUserProfile()
      } else {
        setUserProfile(null)
      }

      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    userProfile,
    login,
    logout,
    signup,
    loginWithGoogle,
    fetchUserProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
