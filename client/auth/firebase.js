import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCzIvB_m4lW9C5szDonRJfedi72ZT4zIfY",
    authDomain: "gssoc-dashboard.firebaseapp.com",
    projectId: "gssoc-dashboard",
    storageBucket: "gssoc-dashboard.appspot.com",
    messagingSenderId: "1011199208346",
    appId: "1:1011199208346:web:a600fd172033e62ec12823",
    measurementId: "G-4RNSRHV4KC"
};

export const FirebaseApp = initializeApp(firebaseConfig);
export const FirebaseAuth = getAuth(FirebaseApp);