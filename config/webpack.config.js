const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: "development",
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, '../webpackBuild'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'first project',
            template: 'public/index.html',
            options: {
                presets: [
                    ['@babel/preset-env', { targets: { node: 'current' } }],
                    ['@babel/preset-react', { targets: { node: 'current' } }] // add this
                ]
            }
        })
    ],
    module: {
        rules: [
            {
                test: /\.js|jsx$/,
                loader: "babel-loader?presets[]=@babel/preset-react,presets[]=@babel/preset-env",
                include: path.resolve(__dirname, '../src'),
                // exclude: [/node_modules/,/public/],
                exclude: /node_modules/,
            },
            {
                test: /\.(css|scss|less)$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'less-loader'
                ],
                include: [path.resolve(__dirname, '../src'),path.resolve(__dirname, '../public/css')],
                // exclude: [path.resolve(__dirname, '../public'),'public','../public']
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader',
                    'url-loader'
                ],
                // include: path.resolve(__dirname, '../src'),
                // exclude: [path.resolve(__dirname, '../public'),'public','../public']
            },
            {
                test: /\.json$/,
                use: [
                    'file-loader',
                    'url-loader'
                ],
                // exclude: [path.resolve(__dirname, '../public'),'public','../public']
            }
        ]
    },
    devServer: {
        contentBase:[path.join(__dirname,"../"),path.join(__dirname,"../public"),],   //不添加会让axios无法读取到public中的资源文件
        // compress:true,
        port:3000,
        // watchOptions: {
        //     ignored: [
        //         path.resolve(__dirname, 'public'),
        //         path.resolve(__dirname, '../public'),
        //     ]
        // }
    }
}