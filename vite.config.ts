import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
	base: './',
	define: {
		BUILD_TIMESTAMP: JSON.stringify(new Date().toLocaleString('hu')),
	},
	plugins: [
		vue({
			// template: {
			// 	compilerOptions: {
			// 		whitespace: 'preserve',
			// 	},
			// },
		}),
		VitePWA({
			registerType: 'prompt',
			filename: 'service-worker.js',
			includeAssets: [
				'favicon.ico' /* , 'apple-touch-icon.png', 'masked-icon.svg' */,
			],
			workbox: {
				navigateFallbackDenylist: [new RegExp('/api/')],
			},
			manifest: {
				name: 'Skrabli',
				short_name: 'Skrabli',
				description: 'Szókirakó játék',
				theme_color: '#000000',
				icons: [
					{
						src: 'pwa-64x64.png',
						sizes: '64x64',
						type: 'image/png',
					},
					{
						src: 'pwa-192x192.png',
						sizes: '192x192',
						type: 'image/png',
					},
					{
						src: 'pwa-512x512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'any',
					},
					{
						src: 'maskable-icon-512x512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'maskable',
					},
				],
			},
		}),
	],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},
	server: {
		port: 3000,
		proxy: {
			'/skrabli/api': 'http://localhost:8080',
		},
	},
})
