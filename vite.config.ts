import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Define the GitHub repository name
const repoName = 'story-maker-frontend';

// https://vitejs.dev/config/
// Use the function form of defineConfig to conditionally set the base path
export default defineConfig(({ command }) => ({
  base: command === 'build' ? `/${repoName}/` : '/', // Set base for build only
  plugins: [
    vue(),
  ],
}))
