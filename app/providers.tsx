'use client';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { theme } from '../src/constants/theme';
import { DirectoryInitializer } from '../src/components/DirectoryInitializer';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            refetchOnWindowFocus: false,
            retry: 3,
            retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
            // Enable background refetching for better UX
            refetchOnMount: 'always',
            refetchOnReconnect: 'always',
            // Network mode for better offline handling
            networkMode: 'offlineFirst',
            // Garbage collection
            gcTime: 1000 * 60 * 30 // 30 minutes (renamed from cacheTime)
          },
          mutations: {
            retry: 1,
            networkMode: 'offlineFirst'
          }
        }
      })
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <DirectoryInitializer />
        {children}
      </QueryClientProvider>
    </ThemeProvider>
  );
}
