import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDXtUDWAAAlkdR3T77zVo0uRhcKEyl7688",
  authDomain: "icubemedia-expensetracker.web.app",
  projectId: "icubemedia-expensetracker",
  storageBucket: "icubemedia-expensetracker.appspot.com",
  messagingSenderId: "714498648527",
  appId: "1:714498648527:ios:3793721e1989e91921caba",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const clientAuth = firebase.auth();

export { clientAuth };