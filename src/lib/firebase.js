import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDjoYMVx8qpJJRh2W6qCF9IE85r9UYc6dE",
  authDomain: "cookies-7fe6b.firebaseapp.com",
  projectId: "cookies-7fe6b",
  storageBucket: "cookies-7fe6b.firebasestorage.app",
  messagingSenderId: "569099166158",
  appId: "1:569099166158:web:e0750fe26d33d2edf84b9f",
  measurementId: "G-75XDFW09LX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Google provider
const googleProvider = new GoogleAuthProvider();

export { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, googleProvider }; 