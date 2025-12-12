'use client';

import {useEffect, useState} from 'react';
import type {User} from 'firebase/auth';
import {onAuthStateChanged} from 'firebase/auth';
import {useAuth} from '@/firebase/provider';

/**
 * A hook that provides the current user and a loading state.
 *
 * It uses the `onAuthStateChanged` method from the Firebase Auth SDK to
 * listen for changes in the user's authentication state.
 *
 * This is a client-side hook, so it can only be used in client components.
 */
export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const auth = useAuth();

  useEffect(() => {
    // The `onAuthStateChanged` method returns an unsubscribe function that can
    // be used to stop listening for changes. We'll return this function from
    // our `useEffect` hook so that it's called when the component is unmounted.
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    // The `useEffect` hook returns a cleanup function that will be called when
    // the component is unmounted. This is where we'll unsubscribe from the
    // `onAuthStateChanged` listener.
    return () => unsubscribe();
  }, [auth]);

  return {user, loading};
}
