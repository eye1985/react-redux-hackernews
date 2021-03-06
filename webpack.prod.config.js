var webpack = require('webpack');

module.exports = {
    entry:['./node_modules/jquery/dist/jquery.js','./node_modules/materialize-css/dist/js/materialize.js','./index.js'],
    context:__dirname,
    output:{
        path:__dirname + '/dist',
        filename:'bundle.js',
        publicPath:"/dist"
    },

    module:{
        loaders:[
            {
                test:/\.js$/,
                exclude:/node_modules/,
                loader:"babel",
                include:__dirname,
                query:{
                    presets:['es2015','react']
                }
            }
        ]
    },

    plugins:[
        new webpack.DefinePlugin({
            'process.env':{
                'NODE_ENV':JSON.stringify('production')
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress:{
                warnings:true
            }
        })
    ]
};
