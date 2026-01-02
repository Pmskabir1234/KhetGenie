import {initializeApp, getApp, getApps, type FirebaseApp} from 'firebase/app';
import {getAuth, type Auth} from 'firebase/auth';
import {getFirestore, type Firestore} from 'firebase/firestore';

import {firebaseConfig} from './config';

export {
  FirebaseProvider,
  FirebaseClientProvider,
  useFirebase,
  useFirebaseApp,
  useFirestore,
  useAuth,
} from './provider';

export { useUser } from './auth/use-user';
export { useCollection } from './firestore/use-collection';
export { useDoc } from './firestore/use-doc';


let app: FirebaseApp;
let auth: Auth;
let firestore: Firestore;

export async function initializeFirebase(): Promise<{
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}> {
  if (getApps().length) {
    app = getApp();
    auth = getAuth(app);
    firestore = getFirestore(app);
  } else {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    firestore = getFirestore(app);
  }
  return {app, auth, firestore};
}
