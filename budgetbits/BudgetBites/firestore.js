import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyC478SdCw7v3l_j23FSpk3tmUFSs2sEHVs",
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