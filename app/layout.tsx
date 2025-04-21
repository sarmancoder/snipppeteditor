import type { Metadata } from 'next'
import './globals.css'
import InstallPrompt from './InstallPrompt'
import Script from 'next/script'

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
    <html lang="en">
      <head>
        <Script src='/script.js'></Script>
      </head>
      <body>
        {children}
        <InstallPrompt />
      </body>
    </html>
  )
}
