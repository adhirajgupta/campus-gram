import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
// import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname),
      '~backend/client': path.resolve(__dirname, './client'),
      '~backend': path.resolve(__dirname, '../backend'),
    },
  },
  plugins: [
    tailwindcss(),
    react(),
//    VitePWA({
//   registerType: 'autoUpdate',
//   includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'robots.txt'],
//   manifest: {
//     name: 'My React PWA',
//     short_name: 'ReactPWA',
//     description: 'A Progressive Web App built with React and Vite',
//     theme_color: '#ffffff',
//     background_color: '#ffffff',
//     display: 'standalone',
//     orientation: 'portrait',
//     scope: '/',
//     start_url: '/',
//     icons: [
//       {
//         src: 'logo192.png',
//         sizes: '192x192',
//         type: 'image/png'
//       },
//       {
//         src: 'logo512.png',
//         sizes: '512x512',
//         type: 'image/png'
//       },
//       {
//         src: 'logo512.png',
//         sizes: '512x512',
//         type: 'image/png',
//         purpose: 'maskable'
//       }
//     ]
//   },
//   workbox: {
//     globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest}'],
//     cleanupOutdatedCaches: true,
//     clientsClaim: true,
//     skipWaiting: true,
//     runtimeCaching: [
//       {
//         urlPattern: /^https:\/\/api\./,
//         handler: 'NetworkFirst',
//         options: {
//           cacheName: 'api-cache',
//           expiration: {
//             maxEntries: 10,
//             maxAgeSeconds: 300 // 5 minutes
//           }
//         }
//       }
//     ]
//   },
//   devOptions: {
//     enabled: true // Enable PWA in development mode
//   }
// })

  ],
  mode: "production",
  build: {
    minify: false,
  },
 server: {
  host: '0.0.0.0',
  port: 5173,
  allowedHosts: [
    "all"
  ],
  cors:true,
    origin: "https://9f9dbfd7f9c9.ngrok-free.app" // to be changed once the final domain comes through

}

})
