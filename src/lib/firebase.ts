import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import firebaseConfigJson from '../../firebase-applet-config.json';

const firebaseConfig = {
  projectId: firebaseConfigJson.projectId || 'model-forklift-7xctm',
  appId: firebaseConfigJson.appId || '1:329784489728:web:db2fe61a5edef51bd365e5',
  apiKey: firebaseConfigJson.apiKey || 'AIzaSyAjr14JDcLegWJzI3lAQJ_wIH0jnkyBFr4',
  authDomain: firebaseConfigJson.authDomain || 'model-forklift-7xctm.firebaseapp.com',
  storageBucket: firebaseConfigJson.storageBucket || 'model-forklift-7xctm.firebasestorage.app',
  messagingSenderId: firebaseConfigJson.messagingSenderId || '329784489728',
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Check if specific firestoreDatabaseId is provided
const databaseId = firebaseConfigJson.firestoreDatabaseId && firebaseConfigJson.firestoreDatabaseId !== '(default)'
  ? firebaseConfigJson.firestoreDatabaseId
  : undefined;

export const db: Firestore = databaseId ? getFirestore(app, databaseId) : getFirestore(app);
export const auth: Auth = getAuth(app);
export default app;
