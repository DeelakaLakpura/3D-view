// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDUvw7F48wXGNNJa_NO58Xru8ucWDjuRzc",
  authDomain: "vfit-8e85e.firebaseapp.com",
  databaseURL: "https://vfit-8e85e-default-rtdb.firebaseio.com",
  projectId: "vfit-8e85e",
  storageBucket: "vfit-8e85e.appspot.com",
  messagingSenderId: "185468595314",
  appId: "1:185468595314:web:50ac7436877a2f716c66eb"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { app, database };
