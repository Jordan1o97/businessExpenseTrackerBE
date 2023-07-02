import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  "lol"

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const clientAuth = firebase.auth();

export { clientAuth };