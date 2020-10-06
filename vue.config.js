module.exports = {
    publicPath: './',

    pluginOptions: {
      i18n: {
        locale: 'ru',
        fallbackLocale: 'en',
        localeDir: 'locales',
        enableInSFC: true
      }
		},
		
		pwa: {

			//опции воркбокса
			// workboxPluginMode: 'InjectManifest',
			workboxPluginMode: 'GenerateSW',
			workboxOptions: {
				// navigateFallback: 'index.html',
				// swSrc: './public/service-worker.js',
				exclude: [/\.map$/, /_redirects/],
			},

			name: "SCHEDO",
			themeColor: '#1890ff',
			msTileColor: '#1890ff',
			manifestOptions: {
				"icons": [
					{
						"src": "img/icons/android-launchericon-512-512.png",
						"type": "image/png",
						"sizes": "512x512",
					},
					{
						"src": "img/icons/android-launchericon-192-192.png",
						"type": "image/png",
						"sizes": "192x192",
						"purpose": "any maskable"
					},
					{
						"src": "img/icons/android-launchericon-144-144.png",
						"type": "image/png",
						"sizes": "144x144",
					},
					{
						"src": "img/icons/android-launchericon-96-96.png",
						"type": "image/png",
						"sizes": "96x96",
					},
					{
						"src": "img/icons/android-launchericon-72-72.png",
						"type": "image/png",
						"sizes": "72x72",
					},
					{
						"src": "img/icons/android-launchericon-48-48.png",
						"type": "image/png",
						"sizes": "48x48",
					},
					{
						"src": "img/icons/apple-icon-180x180.png",
						"type": "image/png",
						"sizes": "180x180",
					},
					{
						"src": "img/icons/apple-icon-152x152.png",
						"type": "image/png",
						"sizes": "152x152",
					},
					{
						"src": "img/icons/apple-icon-144x144.png",
						"type": "image/png",
						"sizes": "144x144"
					},
					{
						"src": "img/icons/apple-icon-120x120.png",
						"type": "image/png",
						"sizes": "120x120"
					},
					{
						"src": "img/icons/apple-icon-114x114.png",
						"type": "image/png",
						"sizes": "114x114"
					},
					{
						"src": "img/icons/favicon-96x96.png",
						"type": "image/png",
						"sizes": "96x96"
					},
					{
						"src": "img/icons/apple-icon-76x76.png",
						"type": "image/png",
						"sizes": "76x76"
					},
					{
						"src": "img/icons/apple-icon-72x72.png",
						"type": "image/png",
						"sizes": "72x72"
					},
					{
						"src": "img/icons/apple-icon-60x60.png",
						"type": "image/png",
						"sizes": "60x60"
					},
					{
						"src": "img/icons/apple-icon-57x57.png",
						"type": "image/png",
						"sizes": "57x57"
					},
					{
						"src": "img/icons/favicon-96x96.png",
						"type": "image/png",
						"sizes": "96x96"
					},
					{
						"src": "img/icons/favicon-32x32.png",
						"type": "image/png",
						"sizes": "32x32"
					},
					{
						"src": "img/icons/favicon-16x16.png",
						"type": "image/png",
						"sizes": "16x16"
					}
				],
			}
		}
}
