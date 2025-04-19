import { createContext, useContext, useEffect, useState } from 'react'
import { auth, db } from '../firebase/firebase'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'

const AuthContext = createContext()
const googleProvider = new GoogleAuthProvider()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  // Example login function
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password)
  }

  // Example logout function
  const logout = () => {
    return signOut(auth)
  }

  const googleSignIn = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider)
      const user = userCredential.user
      console.log('User signed in with Google:', user)

      const profileRef = doc(db, 'profiles', user.uid)
      const profileSnap = await getDoc(profileRef)

      if (!profileSnap.exists()) {
        const initialProfile = {
          name: user.displayName || user.email.split('@')[0],
          username: user.email.split('@')[0],
          email: user.email,
          pfp: user.photoURL || '',
          banner: '',
        }
        setDoc(profileRef, initialProfile)
        console.log('Profile created for: ', user.email)
      } else {
        console.log(
          'Profile already exists for:',
          user.email,
          ', Signing in...'
        )
      }
    } catch (err) {
      console.error('Error during google sign in:', err.message)
      throw err
    }
  }

  const signUp = () => {
    try {
      const createUser = async (email, password) => {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        )
        const user = userCredential.user

        // Create default profile in Firestore
        const profileRef = doc(db, 'profiles', user.uid)

        const profileSnap = await getDoc(profileRef)

        if (!profileSnap.exists()) {
          const initialProfile = {
            name: user.displayName || email.split('@')[0],
            username: email.split('@')[0],
            email: email,
            pfp: user.photoURL || '',
            banner: '',
          }

          await setDoc(profileRef, initialProfile)

          return userCredential // in case you need it after
        } else {
          console.log(
            'Profile already exists for:',
            user.email,
            ', Signing in...'
          )
        }
      }
    } catch (err) {
      console.error('Error during sign up:', err.message)
      throw err
    }
  }

  const fetchUserData = () => {}

  const value = {
    currentUser,
    login,
    logout,
    signUp,
    googleSignIn,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
