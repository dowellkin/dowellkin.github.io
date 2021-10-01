module.exports = {
    publicPath: '/',

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
  			background_color: "#001529",
				"icons": [
					{
						"src": "img/icons/maskable/maskable_icon_x48.png",
						"type": "image/png",
						"sizes": "48x48",
						"purpose": "maskable"
					},
					{
						"src": "img/icons/maskable/maskable_icon_x72.png",
						"type": "image/png",
						"sizes": "72x72",
						"purpose": "maskable"
					},
					{
						"src": "img/icons/maskable/maskable_icon_x96.png",
						"type": "image/png",
						"sizes": "96x96",
						"purpose": "maskable"
					},
					{
						"src": "img/icons/maskable/maskable_icon_x128.png",
						"type": "image/png",
						"sizes": "128x128",
						"purpose": "maskable"
					},
					{
						"src": "img/icons/maskable/maskable_icon_x192.png",
						"type": "image/png",
						"sizes": "192x192",
						"purpose": "maskable"
					},
					{
						"src": "img/icons/maskable/maskable_icon_x384.png",
						"type": "image/png",
						"sizes": "384x384",
						"purpose": "maskable"
					},
					{
						"src": "img/icons/maskable/maskable_icon_x512.png",
						"type": "image/png",
						"sizes": "512x512",
						"purpose": "maskable"
					},

					{
						"src": "img/icons/icon-512x512.png",
						"type": "image/png",
						"sizes": "512x512",
					},
					{
						"src": "img/icons/icon-192x192.png",
						"type": "image/png",
						"sizes": "192x192",
					},
					{
						"src": "img/icons/apple-icon-144x144.jpg",
						"type": "image/jpg",
						"sizes": "144x144",
					},
					{
						"src": "img/icons/favicon-96x96.jpg",
						"type": "image/jpg",
						"sizes": "96x96",
					},
					{
						"src": "img/icons/apple-icon-72x72.jpg",
						"type": "image/jpg",
						"sizes": "72x72",
					},
					// {
					// 	"src": "img/icons/android-launchericon-48-48.png",
					// 	"type": "image/png",
					// 	"sizes": "48x48",
					// },
					{
						"src": "img/icons/apple-icon-180x180.jpg",
						"type": "image/jpg",
						"sizes": "180x180",
					},
					{
						"src": "img/icons/apple-icon-152x152.jpg",
						"type": "image/jpg",
						"sizes": "152x152",
					},
					{
						"src": "img/icons/apple-icon-144x144.jpg",
						"type": "image/jpg",
						"sizes": "144x144"
					},
					{
						"src": "img/icons/apple-icon-120x120.jpg",
						"type": "image/jpg",
						"sizes": "120x120"
					},
					{
						"src": "img/icons/apple-icon-114x114.jpg",
						"type": "image/jpg",
						"sizes": "114x114"
					},
					// {
					// 	"src": "img/icons/favicon-96x96.jpg",
					// 	"type": "image/jpg",
					// 	"sizes": "96x96"
					// },
					{
						"src": "img/icons/apple-icon-76x76.jpg",
						"type": "image/jpg",
						"sizes": "76x76"
					},
					{
						"src": "img/icons/apple-icon-72x72.jpg",
						"type": "image/jpg",
						"sizes": "72x72"
					},
					{
						"src": "img/icons/apple-icon-60x60.jpg",
						"type": "image/jpg",
						"sizes": "60x60"
					},
					{
						"src": "img/icons/apple-icon-57x57.jpg",
						"type": "image/jpg",
						"sizes": "57x57"
					},
					{
						"src": "img/icons/favicon-96x96.jpg",
						"type": "image/jpg",
						"sizes": "96x96"
					},
					{
						"src": "img/icons/favicon-32x32.jpg",
						"type": "image/jpg",
						"sizes": "32x32"
					},
					{
						"src": "img/icons/favicon-16x16.jpg",
						"type": "image/jpg",
						"sizes": "16x16"
					},
				],

				shortcuts: [
					{
						name: "Расписание",
						url: "/",
						icons: [
							{
								"src": "img/icons/shortcuts/schedule.png",
								"type": "image/png",
								"sizes": "96x96"
							}		
						]

					},
					{
						name: "Ссылки",
						url: "/links/",
						icons: [
							{
								"src": "img/icons/shortcuts/link.png",
								"type": "image/png",
								"sizes": "96x96"
							}		
						]
					}
				]
			},
		}
}
