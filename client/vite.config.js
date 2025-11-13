// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react(), tailwindcss()],
  
// })


// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Prevent Vite from watching backend, node_modules, .git, OneDrive etc.
    watch: {
      ignored: [
        '**/backend/**',
        '**/node_modules/**',
        '**/.git/**',
        '**/.vscode/**',
        '**/dist/**',
        // ignore OneDrive temp paths (Windows)
        '**/OneDrive/**',
        '**/OneDrive - **/**'
      ]
    },
    // Optional: if your frontend calls backend during dev, set a proxy
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:5000',
    //     changeOrigin: true,
    //     secure: false
    //   }
    // }
  }
})
