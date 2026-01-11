import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  enableIndexedDbPersistence
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDlrfVa61ePAwS8E4129tyJzTmtEiE0SqM",
  authDomain: "smart-logistics-quiz.firebaseapp.com",
  projectId: "smart-logistics-quiz",
  storageBucket: "smart-logistics-quiz.firebasestorage.app",
  messagingSenderId: "668279170218",
  appId: "1:668279170218:web:18967f4f398fc9a70c5cd3"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

enableIndexedDbPersistence(db).catch(() => {});

export { collection, addDoc, serverTimestamp };
