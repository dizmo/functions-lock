module.exports = {
    devtool: 'source-map',
    entry: [
        './dist/lib/index.js'
    ],
    module: {
        rules: [{
            test: /\.js$/i,
            use: ['source-map-loader'],
            enforce: 'pre'
        }]
    }
};
