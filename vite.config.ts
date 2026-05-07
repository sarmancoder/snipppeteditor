import generouted from '@generouted/react-router/plugin'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import basicSsl from '@vitejs/plugin-basic-ssl'
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    basicSsl(),
    react(), generouted(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: { enabled: true, type: 'module' },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,tsx,ts}'],
        navigateFallback: 'index.html',
        // IMPORTANTE: Evita que el SW se quede esperando
        skipWaiting: true,
        clientsClaim: true,
      },
      manifest: {
        "short_name": "SnippetManagerPWA",
        "name": "Snippet manager PWA",
        "icons": [
          {
            "src": "pwa-64x64.png",
            "sizes": "64x64",
            "type": "image/png"
          },
          {
            "src": "pwa-192x192.png",
            "sizes": "192x192",
            "type": "image/png"
          },
          {
            "src": "pwa-512x512.png",
            "sizes": "512x512",
            "type": "image/png"
          },
          {
            "src": "maskable-icon-512x512.png",
            "sizes": "512x512",
            "type": "image/png",
            "purpose": "maskable"
          }
        ],
        "start_url": ".",
        "display": "standalone",
        "theme_color": "black",
        "background_color": "white"
      },
    })
  ],
  server: {
    // hmr: false,
    host: '127.0.0.1'  // fuerza IPv4
  }
})
