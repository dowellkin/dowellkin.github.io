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
			name: "SCHEDO",
			themeColor: '#1890ff',
			msTileColor: '#1890ff',
			manifestOptions: {
				"icons": [{
						"src": "/android-icon-192x192.png",
						"type": "image/png",
						"sizes": "192x192"
					},
					{
						"src": "/apple-icon-180x180.png",
						"type": "image/png",
						"sizes": "180x180"
					},
					{
						"src": "/apple-icon-152x152.png",
						"type": "image/png",
						"sizes": "152x152"
					},
					{
						"src": "/apple-icon-144x144.png",
						"type": "image/png",
						"sizes": "144x144"
					},
					{
						"src": "/apple-icon-120x120.png",
						"type": "image/png",
						"sizes": "120x120"
					},
					{
						"src": "/apple-icon-114x114.png",
						"type": "image/png",
						"sizes": "114x114"
					},
					{
						"src": "/favicon-96x96.png",
						"type": "image/png",
						"sizes": "96x96"
					},
					{
						"src": "/apple-icon-76x76.png",
						"type": "image/png",
						"sizes": "76x76"
					},
					{
						"src": "/apple-icon-72x72.png",
						"type": "image/png",
						"sizes": "72x72"
					},
					{
						"src": "/apple-icon-60x60.png",
						"type": "image/png",
						"sizes": "60x60"
					},
					{
						"src": "/apple-icon-57x57.png",
						"type": "image/png",
						"sizes": "57x57"
					},
					{
						"src": "/favicon-32x32.png",
						"type": "image/png",
						"sizes": "32x32"
					},
					{
						"src": "/favicon-16x16.png",
						"type": "image/png",
						"sizes": "16x16"
					}
				],
			}
		}
}
