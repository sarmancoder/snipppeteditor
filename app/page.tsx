'use client'

import React from 'react'
import dynamic from 'next/dynamic'

// Esto desactiva el renderizado de servidor para este componente específico
const DualEditorPage = dynamic(() => import('./app'), {
  ssr: false,
})

export default function page() {
  return (
    <DualEditorPage />
  )
}
