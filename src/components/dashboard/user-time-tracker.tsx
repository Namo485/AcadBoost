'use client';

import { useEffect, useRef } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { doc, updateDoc, increment } from 'firebase/firestore';

export function UserTimeTracker() {
  const { user } = useUser();
  const firestore = useFirestore();
  const startTimeRef = useRef<number | null>(null);

  const handleBeforeUnload = () => {
    if (!user || !firestore || startTimeRef.current === null) {
      return;
    }

    const endTime = Date.now();
    const timeSpentInSeconds = Math.round((endTime - startTimeRef.current) / 1000);

    if (timeSpentInSeconds > 0) {
      const userDocRef = doc(firestore, 'users', user.uid);
      updateDoc(userDocRef, {
        timeSpent: increment(timeSpentInSeconds),
      }).catch(error => {
        // This is a best-effort operation, so we won't show a UI error
        console.error("Could not update time spent:", error);
      });
    }
  };

  useEffect(() => {
    // Set the start time when the component mounts
    startTimeRef.current = Date.now();

    // Add the event listener for when the user leaves
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup function to remove the listener
    return () => {
      handleBeforeUnload(); // Save any remaining time when component unmounts
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, firestore]);

  // This component does not render anything
  return null;
}
