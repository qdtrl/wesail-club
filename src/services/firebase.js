import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

import { firebaseConfig } from '../config/config';

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);
const rtdb = getDatabase(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);


export { 
    app,
    auth,
    db, 
    rtdb,
    storage,
    analytics
};