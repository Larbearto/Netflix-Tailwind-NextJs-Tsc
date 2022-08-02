// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCob5xCcdHa5lRH_kFliXO_jpT71vKOf18',
  authDomain: 'netflix-clone-2e5a7.firebaseapp.com',
  projectId: 'netflix-clone-2e5a7',
  storageBucket: 'netflix-clone-2e5a7.appspot.com',
  messagingSenderId: '974118149045',
  appId: '1:974118149045:web:4ab6e406594074171917fc'
}

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
const db = getFirestore()
const auth = getAuth()

export default app
export { auth, db }
