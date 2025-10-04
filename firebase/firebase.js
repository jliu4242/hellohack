import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDpD1649O298nH_55ubmOPCKUy0jAwcyuY",
    authDomain: "jobtracker-e3561.firebaseapp.com",
    projectId: "jobtracker-e3561",
    storageBucket: "jobtracker-e3561.firebasestorage.app",
    messagingSenderId: "623352889065",
    appId: "1:623352889065:web:6bccb0c9f810488f8dfa78",
    measurementId: "G-JHM2JJDWP8"
}

export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
