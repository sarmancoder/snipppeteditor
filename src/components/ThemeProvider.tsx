/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import React, { useState } from 'react';
import { uiStates } from './uiStates';
import { useMyThemeProviderContext } from './useMyThemeProviderContext';

export const myThemeProviderContext = React.createContext<any>(null)

export const localStorageDarkModeKey = 'dark-mode'
export function useMyThemeProvider() {
  const darkMode = localStorage.getItem(localStorageDarkModeKey)
  const [dark, setdark] = useState(darkMode == uiStates.dark)
  return {
    dark,
    setDark(dark: any) {
      setdark(dark == uiStates.dark)
    }
  }
}

const theme = (mode: any) => createTheme({
    palette: { mode }
});

export default function MyThemeProvider({children}: any) {
  const data = useMyThemeProvider()
  return (
    <myThemeProviderContext.Provider value={data}>
      <MuiThemeProvider>
        {children}
      </MuiThemeProvider>
    </myThemeProviderContext.Provider>
  )
}

function MuiThemeProvider({children}: any) {
  const {dark} = useMyThemeProviderContext()
  return (
    <ThemeProvider theme={theme(dark ? 'dark' : 'light')} defaultMode='dark'>
      <CssBaseline /> {/* Esto normaliza los estilos de los navegadores */}
      {children}
    </ThemeProvider>
  );
}