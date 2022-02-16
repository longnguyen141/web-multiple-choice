import firebase from 'firebase'
const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyBVTTTQhr7pzfHZbltF5Y_VE4THrsSDDLc",
    authDomain: "multiple-choice-be0fe.firebaseapp.com",
    projectId: "multiple-choice-be0fe",
    storageBucket: "multiple-choice-be0fe.appspot.com",
    messagingSenderId: "275520714779",
    appId: "1:275520714779:web:713d3a62e4e1759c2da0be",
    measurementId: "G-HXBSB8GNZ3"
})
const db = firebaseApp.firestore();
export const storage = firebase.storage();
export const auth = firebase.auth();

export default db;