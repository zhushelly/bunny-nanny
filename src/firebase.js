import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, serverTimestamp, GeoPoint } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
    apiKey: "AIzaSyBv9C0e45S2cbOCp10G689nROaotCBdn0Y",
    authDomain: "bunny-nanny.firebaseapp.com",
    projectId: "bunny-nanny",
    storageBucket: "bunny-nanny.appspot.com",
    messagingSenderId: "640935742680",
    appId: "1:640935742680:web:b75f4cadbb732e56115bad",
    measurementId: "G-QGYEGQ5YE5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);


export { auth, db, serverTimestamp, storage, GeoPoint};
