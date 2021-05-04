module.exports = {
    lintOnSave: false,
    devServer: {
        proxy: {
            '^/v1': {
                target: "http://localhost:3000",
                changeOrigin: true
            },
        }
    }
}