/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useContext } from 'react';
import { useMyThemeProvider, myThemeProviderContext } from './ThemeProvider';


export function useMyThemeProviderContext() {
  return useContext<ReturnType<typeof useMyThemeProvider>>(myThemeProviderContext);
}
