import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

// Configuration
var firebaseConfig = {
  apiKey: "AIzaSyBIRwthTYDSHJF79vqtQ1K4RAPRI3KtwT0",
  authDomain: "wiki-268220.firebaseapp.com",
  databaseURL: "https://wiki-268220.firebaseio.com",
  projectId: "wiki-268220",
  storageBucket: "wiki-268220.appspot.com",
  messagingSenderId: "689923173553",
  appId: "1:689923173553:web:6cc9ffc6f9bdb298cb8690",
  measurementId: "G-9MPPLB28PQ"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;