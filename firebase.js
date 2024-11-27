import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import firebaseConfig from './firebaseConfig';
// Initialize Firebase
firebase.initializeApp(firebaseConfig);


// Initialize Firebase Authentication and get a reference to the service
export const auth = firebase.auth();
