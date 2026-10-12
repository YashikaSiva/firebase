
import { initializeApp } from
"https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import { getAuth } from
"https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import { getFirestore } from
"https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAWNaK0osCp1KqkHTlT-SJnWLS1C9ddiGc",
  authDomain: "cloud-26015.firebaseapp.com",
  projectId: "cloud-26015",
  storageBucket: "cloud-26015.firebasestorage.app",
  messagingSenderId: "269303056405",
  appId: "1:269303056405:web:d212dc1be861a870b5661c"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
