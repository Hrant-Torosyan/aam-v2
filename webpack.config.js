const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.tsx',  // Make sure your entry is pointing to your main .tsx file
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    mode: 'development',
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],  // Allow Webpack to resolve .ts and .tsx files
        alias: {
            '@': path.resolve(__dirname, 'src'), // Alias for 'src' folder
        },
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,  // Apply ts-loader for TypeScript files
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    devServer: {
        static: './dist',
        port: 3000,
        open: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
        }),
    ],
};