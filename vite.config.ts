import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import dsv from '@rollup/plugin-dsv'

export default defineConfig({  plugins: [    tailwindcss(), dsv(), ],
    base: '/spaco/',
})