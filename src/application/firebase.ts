// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyClh94GfCciQNOjZBDo0gMztyDfVS_h4Ys",
	authDomain: "imitate-303113.firebaseapp.com",
	projectId: "imitate-303113",
	storageBucket: "imitate-303113.appspot.com",
	messagingSenderId: "468434090775",
	appId: "1:468434090775:web:0702e3ada33da62f15d552",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const firestore = getFirestore(app);

import { getDatabase } from "firebase/database";
