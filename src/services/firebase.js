import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore/lite';
import { getAuth } from "firebase/auth";

import { firebaseConfig } from '../config/config';

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth();


export { 
    app,
    auth,
    db, 
    analytics
};