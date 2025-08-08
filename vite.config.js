import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  plugins: [svelte()],
  publicDir: 'public',
  build: {
    outDir: 'dist',  // Carpeta donde se guardará la construcción de producción
    sourcemap: true,  // Genera archivos sourcemap para depuración
    minify: 'esbuild',  // Usa esbuild para la minificación, que es muy rápido
    chunkSizeWarningLimit: 500,  // Ajusta el límite de tamaño para los "chunks"
  },
  server: {
    historyApiFallback: true, // Asegura que las rutas se manejen en local
  },
  resolve: {
    alias: {
      '@components': '/src/components',  // Alias para la carpeta de componentes
      '@utils': '/src/utils',  // Alias para la carpeta de utilidades (si tienes alguna)
    },
  },
})
