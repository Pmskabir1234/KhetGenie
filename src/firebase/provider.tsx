'use client';

import {createContext, useContext} from 'react';
import type {Auth} from 'firebase/auth';
import type {FirebaseApp} from 'firebase/app';
import type {Firestore} from 'firebase/firestore';

/**
 * A new React context is created to hold the initialized Firebase services.
 */
const FirebaseContext = createContext<{
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
} | null>(null);

/**
 * A new React hook is created to provide access to the initialized Firebase services.
 *
 * It uses the `useContext` hook to access the `FirebaseContext` and returns the
 * value of the context.
 *
 * If the hook is used outside of a `FirebaseProvider`, it will throw an error.
 */
export function useFirebase() {
  const context = useContext(FirebaseContext);

  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }

  return context;
}

/**
 * These are helper hooks that provide access to the individual Firebase services.
 *
 * They use the `useFirebase` hook to get the full context value and then return
 * the individual services.
 *
 * This is a convenience for consumers of the context, so they don't have to
 * destructure the context value every time.
 */
export const useFirebaseApp = () => useFirebase().app;
export const useAuth = () => useFirebase().auth;
export const useFirestore = () => useFirebase().firestore;

/**
 * The `FirebaseProvider` is a new React component that will be used to wrap the
 * application and provide the initialized Firebase services to all children.
 *
 * It takes the initialized Firebase services as props and provides them to the
 * `FirebaseContext`.
 *
 * This is the magic that makes the `useFirebase` hook work.
 */
export function FirebaseProvider({
  children,
  ...value
}: {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
  children: React.ReactNode;
}) {
  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
}

/**
 * A client-side component that initializes Firebase and provides it to all children.
 *
 * This is a re-export of the `FirebaseClientProvider` component from the
 * `./client` module.
 *
 * We re-export it here so that consumers of the library don't have to know
 * about the `./client` module.
 */
export {FirebaseClientProvider} from './client-provider';
