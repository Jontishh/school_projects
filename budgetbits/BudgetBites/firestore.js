import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "-",
    authDomain: "budgetbites-userdb.firebaseapp.com",
    projectId: "budgetbites-userdb",
    storageBucket: "budgetbites-userdb.appspot.com",
    messagingSenderId: "626318363822",
    appId: "1:626318363822:web:f54d52a284748d77bf713f",
    measurementId: "G-HK1TWMRYBL"
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
