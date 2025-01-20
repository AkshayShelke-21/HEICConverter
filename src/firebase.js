import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBQXV0eMLEiOZHc5x8yk4Vwt_QmvoTK3fs",
  authDomain: "converter-3f4b2.firebaseapp.com",
  projectId: "converter-3f4b2",
  storageBucket: "converter-3f4b2.firebasestorage.app",
  messagingSenderId: "321525912997",
  appId: "1:321525912997:web:b5d71495af34bedde0444c"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);