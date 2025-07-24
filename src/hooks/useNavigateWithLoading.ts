'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { useLoadingStore } from '@store/loading';

export const useNavigateWithLoading = () => {
  const router = useRouter();
  const setLoading = useLoadingStore(state => state.setLoading);

  const navigateWithLoading = useCallback(
    (path: string) => {
      setLoading(true);

      // Small delay to show loading animation minimum 150ms
      setTimeout(() => {
        router.push(path);

        // Hide loading after navigation
        setTimeout(() => {
          setLoading(false);
        }, 300);
      }, 150);
    },
    [router, setLoading]
  );

  return navigateWithLoading;
};
