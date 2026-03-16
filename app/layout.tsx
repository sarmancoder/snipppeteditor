import type { Metadata } from 'next'
import './globals.css'
import InstallPrompt from './InstallPrompt'
import Script from 'next/script'

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import MyThemeProvider from '@/components/ThemeProvider';

export const metadata: Metadata = {
  title: 'Snippet editor',
  description: 'Snippet editor created partially with v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <head>
        <Script src='/script.js'></Script>
      </head>
      <body>
        <MyThemeProvider>
          {children}
        </MyThemeProvider>
        {/* <InstallPrompt /> */}
      </body>
    </html>
  )
}
