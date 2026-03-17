'use client'

import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import React, { useContext, useState } from 'react';

const myThemeProviderContext = React.createContext<any>(null)

export const localStorageDarkModeKey = 'dark-mode'
export const uiStates = Object.freeze({
    dark: "1",
    light: "0"
})

function useMyThemeProvider() {
  var darkMode = localStorage.getItem(localStorageDarkModeKey)
  const [dark, setdark] = useState(darkMode == uiStates.dark)
  return {
    dark,
    setDark(dark) {
      setdark(dark == uiStates.dark)
    }
  }
}

const theme = (mode) => createTheme({
    palette: { mode }
});

export default function MyThemeProvider({children}) {
  const data = useMyThemeProvider()
  return (
    <myThemeProviderContext.Provider value={data}>
      <MuiThemeProvider>
        {children}
      </MuiThemeProvider>
    </myThemeProviderContext.Provider>
  )
}

export function useMyThemeProviderContext() {
  return useContext<ReturnType<typeof useMyThemeProvider>>(myThemeProviderContext)
}

function MuiThemeProvider({children}) {
  const {dark} = useMyThemeProviderContext()
  return (
    <ThemeProvider theme={theme(dark ? 'dark' : 'light')} defaultMode='dark'>
      <CssBaseline /> {/* Esto normaliza los estilos de los navegadores */}
      {children}
    </ThemeProvider>
  );
}