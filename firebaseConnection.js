// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA-mboqpXHdoybJPgB0t3ni7cydzbJUKEg",
  authDomain: "alimentos-2067b.firebaseapp.com",
  projectId: "alimentos-2067b",
  storageBucket: "alimentos-2067b.appspot.com",
  messagingSenderId: "1094067367538",
  appId: "1:1094067367538:web:cbd48708cbd75442519ceb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const bancoExterno=getFirestore(app);
export {bancoExterno};