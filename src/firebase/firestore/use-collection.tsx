
'use client';

import {useEffect, useState, useRef} from 'react';
import type {
  CollectionReference,
  DocumentData,
  Query,
  QuerySnapshot,
} from 'firebase/firestore';
import {onSnapshot} from 'firebase/firestore';
import {useAuth} from '@/firebase';

/**
 * The options for the `useCollection` hook.
 *
 * @template T The type of the document data.
 */
export type UseCollectionOptions<T> = {
  /**
   * A function that maps the document data to the desired type.
   *
   * @param data The document data.
   * @returns The mapped document data.
   */
  parser?: (data: DocumentData) => T;
};

function defaultParser<T>(data: DocumentData) {
  return data as T;
}

/**
 * A hook that provides a real-time stream of documents from a collection.
 *
 * This hook will automatically unsubscribe from the stream when the component
 * is unmounted.
 *
 * @param ref The collection reference to stream.
 * @param options The options for the hook.
 */
export function useCollection<T>(
  ref: CollectionReference<T> | Query<T> | null,
  options?: UseCollectionOptions<T>
) {
  const {user} = useAuth();
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);

  // We use a ref to store the options so that we can avoid re-running the
  // effect whenever the options change.
  const optionsRef = useRef(options);

  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  useEffect(() => {
    // We don't want to run the effect if the user is not logged in or if the
    // collection reference is not available.
    if (!user || !ref) {
      return;
    }

    setLoading(true);

    const unsubscribe = onSnapshot(
      ref,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const parser = optionsRef.current?.parser ?? defaultParser;
        const data = snapshot.docs.map((doc) => parser(doc.data())) as T[];

        setData(data);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [ref, user]);

  return {data, loading};
}
