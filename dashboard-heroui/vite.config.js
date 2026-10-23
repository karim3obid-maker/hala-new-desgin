import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import {viteSingleFile} from 'vite-plugin-singlefile';

export default defineConfig(({mode})=>({
  plugins:[react(),tailwindcss(),...(mode==='standalone'?[viteSingleFile()]:[])],
  base:'./',
  server:{host:'127.0.0.1',port:4181,strictPort:true},
  preview:{host:'127.0.0.1',port:4181,strictPort:true},
  build:{outDir:mode==='standalone'?'dist-standalone':'dist',assetsInlineLimit:mode==='standalone'?10000000:4096},
}));
