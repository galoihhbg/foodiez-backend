import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyD5sUTqEtrXvVmhBq0JqhC3EuHWRCAz2Ws",
  authDomain: "foody2-6c285.firebaseapp.com",
  projectId: "foody2-6c285",
  storageBucket: "foody2-6c285.appspot.com",
  messagingSenderId: "728766356483",
  appId: "1:728766356483:web:877b886351964123b44236",
  measurementId: "G-3CL30J0CMK"
};

const firebase = initializeApp(firebaseConfig)

export default firebase
