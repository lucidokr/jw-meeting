module.exports = {
    root: "dist/",
    navigateFallback: '/index.html',
    maximumFileSizeToCacheInBytes: 10097152,
    staticFileGlobs: [
      'dist/**.css',
      'dist/**.html',
      'dist/assets/images/**/**.*',
      'dist/assets/lib/**/**.*',
      'dist/**.js'
    ],
    // staticFileGlobs: [
    //   'app/css/**.css',
    //   'app/**.html',
    //   'app/images/**.*',
    //   'app/js/**.js'
    // ],
    stripPrefix: 'dist/',
    runtimeCaching: [{
        urlPattern: "/api/(.*)",
        handler: 'networkFirst'
    }]
};
