import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyBTMmT6YV3pqLSRAbVKzcr5G-UKLZvKny0",
  authDomain: "omkara-dance-studio.firebaseapp.com",
  projectId: "omkara-dance-studio",
  storageBucket: "omkara-dance-studio.firebasestorage.app",
  messagingSenderId: "1081853924330",
  appId: "1:1081853924330:web:bd3cbc8a551438647b5893"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
