// Firebase configuration
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
firebase.initializeApp(firebaseConfig);

// Initialize services
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Enable offline persistence
db.enablePersistence()
    .catch((err) => {
        if (err.code == 'failed-precondition') {
            console.log("Offline persistence can only be enabled in one tab at a time.");
        } else if (err.code == 'unimplemented') {
            console.log("The current browser does not support offline persistence.");
        }
    });

// Export services
export { auth, db, storage };
