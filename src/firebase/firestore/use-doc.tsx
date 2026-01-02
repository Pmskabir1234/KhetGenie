
'use client';

import {useEffect, useState, useRef} from 'react';
import type {
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
} from 'firebase/firestore';
import {onSnapshot} from 'firebase/firestore';
import {useAuth} from '@/firebase/provider';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

/**
 * The options for the `useDoc` hook.
 *
 * @template T The type of the document data.
 */
export type UseDocOptions<T> = {
  /**
   * A function that maps the document data to the desired type.
   *
   * @param data The document data.
   * @returns The mapped document data.
   */
  parser?: (data: DocumentData) => T;
};

/**
 * The default parser for the `useDoc` hook.
 *
 * This function will be used if no parser is provided in the options.
 */
function defaultParser<T>(data: DocumentData) {
  return { id: data.id, ...data } as T;
}

/**
 * A hook that provides a real-time stream of a single document.
 *
 * This hook will automatically unsubscribe from the stream when the component
 * is unmounted.
 *
 * @param ref The document reference to stream.
 * @param options The options for the hook.
 */
export function useDoc<T>(
  ref: DocumentReference<T> | null,
  options?: UseDocOptions<T>
) {
  const {user} = useAuth();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  // We use a ref to store the options so that we can avoid re-running the
  // effect whenever the options change.
  const optionsRef = useRef(options);

  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  useEffect(() => {
    // We don't want to run the effect if the user is not logged in or if the
    // document reference is not available.
    if (!user || !ref) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe = onSnapshot(
      ref,
      (snapshot: DocumentSnapshot<DocumentData>) => {
        if (!snapshot.exists()) {
          setData(null);
          setLoading(false);

          return;
        }

        const parser = optionsRef.current?.parser ?? defaultParser;
        const data = parser({ ...snapshot.data(), id: snapshot.id });

        setData(data as T);
        setLoading(false);
      },
      (error) => {
        const permissionError = new FirestorePermissionError({
          path: ref.path,
          operation: 'get',
        });
        errorEmitter.emit('permission-error', permissionError);
        console.error(error);
        setLoading(false);
        setData(null);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [ref, user]);

  return {data, loading};
}
