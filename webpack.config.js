const path =  require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    mode: 'development',
    entry:"./src/index.js",
    output: {
        path: path.join(__dirname,'/public'),
        filename: 'bundle.js',
        publicPath: './'
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: './src/index.html',
        })
    ],
    module : {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                }
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader", "resolve-url-loader"],
            },
            {
                test: /\.(svg|jpeg|jpg|png|gif)$/i,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[hash].[ext]',
                        publicPath: path.resolve(__dirname, '/public/assets/img'),
                        outputPath: 'assets/img',
                    },
                },
            }
        ]
    }
}