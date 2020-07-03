const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'https://tinylink.larapollehn.de',
            "logLevel": "debug",
            changeOrigin: true,
        })
    );
};