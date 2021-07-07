const Dotenv = require('dotenv-webpack');

module.exports = {
    mode: "production",
    entry: {
        room: "./src/room.js",
    },
    output: {
        library: 'haxbot',
    },
    optimization: {
        minimize: false
    },
    module: {
        rules: [
            { 
                test: /\.js$/, 
                exclude: /node_modules/, 
                loader: "babel-loader"
            }   
        ] 
    },
    plugins: [
        new Dotenv()
    ]
}