import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBq9rFlx1877_eqI8wZGEu1BiyDbiVXkbs",
  authDomain: "signal-ec768.firebaseapp.com",
  projectId: "signal-ec768",
  storageBucket: "signal-ec768.appspot.com",
  messagingSenderId: "644530290070",
  appId: "1:644530290070:web:19d913ed34c24917b131b7",
};

let app;

if (firebase.apps?.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

const db = app.firestore();
const auth = firebase.auth();

export { db, auth };
