import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/* GitHub Pages serves this repo from a subpath, so the production base must
   match the repo name. Dev and local `vite preview` stay at the root. */
const REPO_BASE = '/gflownet-merck-evidence-panel/'

export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? REPO_BASE : '/',
}))
