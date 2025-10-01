"use client";

import { SWRConfig } from 'swr';

interface SWRProviderProps {
  children: React.ReactNode;
}

export function SWRProvider({ children }: SWRProviderProps) {
  return (
    <SWRConfig
      value={{
        // Global SWR configuration
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
        refreshInterval: 0,
        // Keep data fresh for 5 minutes
        dedupingInterval: 5 * 60 * 1000,
        // Retry on error
        errorRetryCount: 3,
        errorRetryInterval: 5000,
        // Loading timeout
        loadingTimeout: 10000,
        // Global fetcher with better error handling
        fetcher: async (url: string) => {
          const res = await fetch(url);
          
          if (!res.ok) {
            const error = new Error(`HTTP ${res.status}: ${res.statusText}`) as Error & { status: number };
            error.status = res.status;
            throw error;
          }
          
          return res.json();
        },
        // Optimize for performance
        isPaused: () => false,
        // Cache provider for better memory usage
        provider: () => new Map(),
      }}
    >
      {children}
    </SWRConfig>
  );
}