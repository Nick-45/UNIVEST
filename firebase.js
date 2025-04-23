// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAwv-QnOAv992yBuyrWNexojiq2WZH75e8",
  authDomain: "univest-183ac.firebaseapp.com",
  projectId: "univest-183ac",
  storageBucket: "univest-183ac.firebasestorage.app",
  messagingSenderId: "817796904444",
  appId: "1:817796904444:web:4514d27605107129812e79",
  measurementId: "G-L7TJ7JFGM3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Collections
const USERS_COLLECTION = "users";
const FARMS_COLLECTION = "farms";
const INVESTMENTS_COLLECTION = "investments";

// Auth functions
export const signUpUser = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const signInUser = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Firestore functions
export const addUser = async (userData) => {
  try {
    const docRef = await addDoc(collection(db, USERS_COLLECTION), userData);
    return docRef.id;
  } catch (e) {
    console.error("Error adding user: ", e);
    throw e;
  }
};

export const addFarm = async (farmData) => {
  try {
    const docRef = await addDoc(collection(db, FARMS_COLLECTION), farmData);
    return docRef.id;
  } catch (e) {
    console.error("Error adding farm: ", e);
    throw e;
  }
};

export const addInvestment = async (investmentData) => {
  try {
    const docRef = await addDoc(collection(db, INVESTMENTS_COLLECTION), investmentData);
    return docRef.id;
  } catch (e) {
    console.error("Error adding investment: ", e);
    throw e;
  }
};

export const getFarms = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, FARMS_COLLECTION));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (e) {
    console.error("Error getting farms: ", e);
    throw e;
  }
};

export const getUserInvestments = async (userId) => {
  try {
    const querySnapshot = await getDocs(collection(db, INVESTMENTS_COLLECTION));
    return querySnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(investment => investment.userId === userId);
  } catch (e) {
    console.error("Error getting investments: ", e);
    throw e;
  }
};

export { db, auth };
