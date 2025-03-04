import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    react(),
    VitePWA({
      strategies: 'injectManifest', // Enable writing custom service worker
      srcDir: 'src',  
      filename: 'sw.ts',
      injectManifest: {
        injectionPoint: 'self.__WB_MANIFEST',
        globPatterns: [
          "**\/*.{js,css,html,ico,png,svg,gif,webmanifest}",
        ]
      },
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true // Run the service worker in dev mode
      },
      manifest: {
        orientation: 'portrait',
        name: "VERIFAI",
        short_name: "VERIFAI",
        start_url: "./",
        display: 'standalone',
        theme_color: '#FFFFFF',
        background_color: "#FFFFFF",
        description: "Empowering global health with AI-based diagnostics",
        icons: [
          {
            "src": "/pwa-192x192.png",
            "sizes": "192x192",
            "type": "image/png",
            "purpose": "any"
          },
          {
            "src": "/pwa-512x512.png",
            "sizes": "512x512",
            "type": "image/png",
            "purpose": "any"
          },
          {
            "src": "/pwa-maskable-192x192.png",
            "sizes": "192x192",
            "type": "image/png",
            "purpose": "maskable"
          },
          {
            "src": "/pwa-maskable-512x512.png",
            "sizes": "512x512",
            "type": "image/png",
            "purpose": "maskable"
          }
        ]
      },
    })
  ],
})
