'use client'

import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"


export default function InstallPrompt() {
    const [isIOS, setIsIOS] = useState(false)
    const [isStandalone, setIsStandalone] = useState(false)
   
    useEffect(() => {
        
      setIsIOS(
        /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
      )
   
      setIsStandalone(window.matchMedia('(display-mode: standalone)').matches)
    }, [])
   
    if (isStandalone) {
      return null // Don't show install button if already installed
    }
   
    return (
      <div className="fixed bottom-4 left-4 bg-white shadow-lg w-[320px] h-[120px] rounded p-4">
        <h3 className="text-3xl">Install App</h3>
        <div className="flex justify-end mt-5">
            <Button variant={'default'} onClick={async () => {
                try {
                    await (window as any).installPrompt.prompt()
                } catch (error) {
                    console.log(error)
                    alert('No se puedo instalar la pwaº')
                }
            }}>
                Add to home screen
            </Button>
        </div>
        {isIOS && (
          <p>
            To install this app on your iOS device, tap the share button
            <span role="img" aria-label="share icon">
              {' '}
              ⎋{' '}
            </span>
            and then "Add to Home Screen"
            <span role="img" aria-label="plus icon">
              {' '}
              ➕{' '}
            </span>.
          </p>
        )}
      </div>
    )
  }