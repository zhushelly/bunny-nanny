import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyD8GsjUnnI1Y-mhFj-4XCEbM8j7vwIq0lE",
    authDomain: "bunny-nanny.firebaseapp.com",
    projectId: "bunny-nanny",
    storageBucket: "bunny-nanny.appspot.com",
    messagingSenderId: "640935742680",
    appId: "1:640935742680:web:b75f4cadbb732e56115bad",
    measurementId: "G-QGYEGQ5YE5"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

export { auth, db };
