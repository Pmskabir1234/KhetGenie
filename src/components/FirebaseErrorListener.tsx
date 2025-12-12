'use client';

import {useCallback, useEffect} from 'react';
import {useToast} from '@/hooks/use-toast';
import {errorEmitter} from '@/firebase/error-emitter';

/**
 * A React component that listens for `permission-error` events on the `errorEmitter`
 * and displays a toast notification when one is received.
 *
 * We use a toast to display the error because it's a good way to show a non-blocking
 * message to the user.
 *
 * @see https://ui.shadcn.com/docs/components/toast
 */
export function FirebaseErrorListener() {
  const {toast} = useToast();

  const handleError = useCallback(
    (error: Error) => {
      // In a real application, you'd probably want to log this error to a
      // third-party service like Sentry or Bugsnag.
      //
      // For this example, we'll just log it to the console.
      console.error(error);

      // We can also display a toast notification to the user.
      toast({
        variant: 'destructive',
        title: 'Oh no! Something went wrong.',
        description:
          'There was a problem with your request. Please try again.',
      });
    },
    [toast]
  );

  useEffect(() => {
    // We subscribe to the `permission-error` event on the `errorEmitter` and
    // call the `handleError` function when the event is emitted.
    errorEmitter.on('permission-error', handleError);

    // We return a cleanup function that will be called when the component is
    // unmounted. This is important to prevent memory leaks.
    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, [handleError]);

  return null;
}
