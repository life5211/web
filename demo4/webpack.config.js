let path = require('path');
const pluginHtmlWeb = require('html-webpack-plugin')

module.exports = {
    entry: "./src/index.js",
    output: {
        //文件名称
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist")
    }
    , mode: 'development',
    // loader 配置
    module: {
        rules: [
            {
                test: /\.css$/,
                //use 由下至上  css to js  append to html 
                use: [
                    "style-loader",
                    "css-loader"
                ]
            },
            {
                test: /\.(jpg|jpeg|png)$/,
                loader: 'url-loader',
                // 内容
                options: {
                    limit: 9 * 1024,
                    esModule: false,
                    //取图片hahs前十位
                    name: '[hash:10].[ext]'
                }
            },
            {
                test: /\.html$/,
                use: ['html-loader']
            }


        ]
    },
    plugins: [
        new pluginHtmlWeb({
            template: './src/index.html'
        })
    ],
    devServer: {
        contentBase: path.resolve(__dirname, "dist"),
        // 编码压缩
        compress: true,
        port: 8001,
        open: true
    }
}