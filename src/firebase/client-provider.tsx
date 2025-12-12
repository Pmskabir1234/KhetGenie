'use client';

import {useEffect, useState} from 'react';
import type {Auth} from 'firebase/auth';
import type {FirebaseApp} from 'firebase/app';
import type {Firestore} from 'firebase/firestore';

import {initializeFirebase} from '@/firebase';
import {FirebaseProvider} from '@/firebase/provider';
import {usePathname} from 'next/navigation';
import {FirebaseErrorListener} from '@/components/FirebaseErrorListener';

type FirebaseServices = {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
};

/**
 * A client-side component that initializes Firebase and provides it to all children.
 *
 * It ensures that Firebase is initialized only once on the client and that the initialized
 * instance is available to all child components.
 *
 * Because it's a client component, it's a good place to listen for Firebase related
 * errors and display them to the user. In this case, we're using the
 * `<FirebaseErrorListener />` component to listen for errors and display them in a toast.
 */
export function FirebaseClientProvider({children}: {children: React.ReactNode}) {
  const [firebase, setFirebase] = useState<FirebaseServices | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // We only want to initialize Firebase once on the client, so we use a `useEffect`
    // hook with an empty dependency array.
    //
    // The `initializeFirebase` function returns a promise, so we use a `.then()` to
    // get the value and set it in our state.
    //
    // We also clear the `firebase` state when the user navigates to a different page, so
    // that we can re-initialize it if needed.
    initializeFirebase().then(setFirebase);

    return () => {
      setFirebase(null);
    };
  }, [pathname]);

  if (!firebase) {
    // We need to wait for Firebase to be initialized before we can render the children,
    // so we return `null` here.
    //
    // In a real application, you'd probably want to show a loading spinner here.
    return null;
  }

  return (
    <>
      <FirebaseErrorListener />
      <FirebaseProvider
        app={firebase.app}
        auth={firebase.auth}
        firestore={firebase.firestore}
      >
        {children}
      </FirebaseProvider>
    </>
  );
}
