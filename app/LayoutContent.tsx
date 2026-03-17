'use client'
import dynamic from 'next/dynamic'

const MyThemeProvider = dynamic(() => import('../components/ThemeProvider'), {
  ssr: false,
})

export default function LayoutContent({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <MyThemeProvider>
      {children}
    </MyThemeProvider>
  )
}
