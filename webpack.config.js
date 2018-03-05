const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env) => {
    const isDevBuild = !(env && env.prod);
    const inputFile = path.join(__dirname, 'scripts', 'App.js');
    const outputDir = path.join(__dirname, 'dist');
    return {
        stats: { modules: false },
        resolve: {
            extensions: ['.js', '.jsx'],
            alias: { moment: 'moment/moment.js' }
        },
        entry: {
            app: inputFile,
            // vendor: ['react', 'react-dom', 'mobx', 'mobx-react']
        },
        output: {
            filename: '[name].js',
            path: outputDir,
            publicPath: '/react-file-browser/dist/',
        },
        devServer: {
            hot: true,
            historyApiFallback: true,
            watchContentBase: true,
            contentBase: path.resolve(__dirname)
        },
        module: {
            rules: [{
                    test: /\.js(x?)$/,
                    include: /scripts/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: isDevBuild,
                            babelrc: false,
                            presets: [
                                ['env', {
                                    targets: { "browsers": ["last 2 versions", "ie >= 7"] },
                                    modules: false,
                                    useBuiltIns: false,
                                    debug: false,
                                }],
                                "stage-0", "react"
                            ],
                            plugins: ["transform-decorators-legacy", "transform-runtime"].concat(
                                isDevBuild ? [] : 
                                ["transform-react-constant-elements", "transform-react-inline-elements"]
                            )
                        }
                    }
                },
                { test: /\.css$/, 
                    use: ExtractTextPlugin.extract({ 
                        use: [{
                            loader: 'css-loader',
                            options: {
                                module: false,
                                minimize: isDevBuild ? false : true,
                                localIdentName: '_[name]__[local]_[hash:base64:5]'
                            }
                        }, {
                            loader: 'postcss-loader',
                            options: {
                                plugins: () => [autoprefixer]
                            }
                        }]
                    })
                },
                { test: /\.(png|eot|ttf|svg)(\?|$)/, use: 'url-loader?limit=100000' },
                { test: /\.(woff|woff2)(\?|$)/, use: 'url-loader?limit=10000&mimetype=application/font-woff' }
            ]
        },
        plugins: [
            new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-tw/),
            new ExtractTextPlugin('site.css'),
            new webpack.optimize.CommonsChunkPlugin({
                name: "vendor",
                fileName: "vendor.js",
                minChunks: Infinity
            }),
        ].concat(isDevBuild ? [
            new webpack.HotModuleReplacementPlugin(),
            new webpack.SourceMapDevToolPlugin({
                filename: '[file].map',
                moduleFilenameTemplate: path.relative(outputDir, '[resourcePath]') // Point sourcemap entries to the original file locations on disk
            }),
            new HtmlWebpackPlugin({
                title: 'mobx',
                filename: path.join(__dirname, 'index.html'),
                template: path.join(__dirname, 'template.html'),
                hash: true
            })
        ] : [
            new webpack.optimize.UglifyJsPlugin()
        ])
    };
};