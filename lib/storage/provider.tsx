'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { StorageAdapter, StorageMode } from './types';
import { localAdapter } from './local-adapter';
import { supabaseAdapter } from './supabase-adapter';

interface StorageContextValue {
  adapter: StorageAdapter;
  mode: StorageMode;
  isReady: boolean;
  switchMode: (mode: StorageMode) => void;
}

const StorageContext = createContext<StorageContextValue | null>(null);

export function StorageProvider({ children }: { children: React.ReactNode }) {
  const [adapter, setAdapter] = useState<StorageAdapter>(localAdapter);
  const [mode, setMode] = useState<StorageMode>('local');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Detect which storage mode to use
    const detectStorageMode = () => {
      // Check if Supabase is available
      if (supabaseAdapter.isAvailable()) {
        // Check user preference from localStorage
        const preference = localStorage.getItem('storage-mode') as StorageMode;
        
        if (preference === 'local') {
          setAdapter(localAdapter);
          setMode('local');
        } else {
          // Default to Supabase if available
          setAdapter(supabaseAdapter);
          setMode('supabase');
        }
      } else {
        // Fallback to local storage
        setAdapter(localAdapter);
        setMode('local');
      }
      
      setIsReady(true);
    };

    detectStorageMode();
  }, []);

  const switchMode = (newMode: StorageMode) => {
    if (newMode === 'supabase' && !supabaseAdapter.isAvailable()) {
      console.warn('Supabase is not available, cannot switch to supabase mode');
      return;
    }

    const newAdapter = newMode === 'local' ? localAdapter : supabaseAdapter;
    setAdapter(newAdapter);
    setMode(newMode);
    localStorage.setItem('storage-mode', newMode);
  };

  return (
    <StorageContext.Provider value={{ adapter, mode, isReady, switchMode }}>
      {children}
    </StorageContext.Provider>
  );
}

export function useStorage() {
  const context = useContext(StorageContext);
  if (!context) {
    throw new Error('useStorage must be used within StorageProvider');
  }
  return context;
}
