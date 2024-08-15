import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import AutoImport from 'unplugin-auto-import/vite'

import { resolve } from 'path'
import { copyFileSync } from 'fs'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    uni(),
    AutoImport({
      imports: [
        'vue',
        'uni-app'
      ]
    }),
    {
      name: 'copy-404',
      closeBundle() {
        // 将 public/404.html 复制到输出目录
        const outputDir = resolve(__dirname, 'dist/build/h5');
        const sourceFile = resolve(__dirname, 'public/404.html');
        const destinationFile = resolve(outputDir, '404.html');
        copyFileSync(sourceFile, destinationFile);
        console.log('404.html copied to', destinationFile);
      }
    }
  ],
  build: {
    outDir: 'dist/build/h5', // 输出目录
    rollupOptions: {
      input: {
        main: 'index.html',
        // 其他入口文件
      }
    }
  }
})