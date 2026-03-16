'use client'

import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';

const theme = createTheme({
    palette: {
        // mode: 'dark'
    }
});

export default function MyThemeProvider({children}) {
  return (
    <ThemeProvider theme={theme} defaultMode='dark'>
      <CssBaseline /> {/* Esto normaliza los estilos de los navegadores */}
      {children}
    </ThemeProvider>
  );
}