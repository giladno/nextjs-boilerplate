module.exports = require('next-images')(
    require('next-offline')({
        webpack(config) {
            config.node = {fs: 'empty'};
            return config;
        },
        env: {},
        workboxOpts: {
            runtimeCaching: [
                {
                    urlPattern: /^https?.*/,
                    handler: 'networkFirst',
                    options: {
                        cacheName: 'https-calls',
                        networkTimeoutSeconds: 15,
                        expiration: {maxEntries: 150, maxAgeSeconds: 30 * 24 * 60 * 60},
                        cacheableResponse: {statuses: [0, 200]},
                    },
                },
            ],
        },
    })
);
