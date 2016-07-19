const path = require("path");

module.exports = {
    context: path.resolve("./src"),
    entry: {
        "mb": [ "./mb/app/ApplicationController.js" ]
    },
    output: {
        path: "./public/assets",
        publicPath: "/assets/",
        filename: "[name]/index.js"
    },
    devServer: {
        contentBase: "./public"
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loaders: [
                    "ui5-loader?sourceRoot=./src",
                    "babel-loader?sourceRoot=./src"
                ]
            }
        ]
    }
};
