import ExtractTextPlugin from "extract-text-webpack-plugin";
import path from "path";

const phaserModule = path.join(__dirname, "node_modules/phaser");
const phaser = path.join(phaserModule, "build/custom/phaser-split.js");
const pixi = path.join(phaserModule, "build/custom/pixi.js");
const p2 = path.join(phaserModule, "build/custom/p2.js");

module.exports = {
	output: {
		filename: "bundle.js"
	},
	module: {
		loaders: [
			{
				test: /\.scss$/,
				exclude: /(node_modules)/,
				loader: ExtractTextPlugin.extract("style", "css", "sass")
			},
			{
				test: /\.js$/,
				exclude: /(node_modules)/,
				loader: "babel",
				query: {
					presets: [ "es2015" ]
				}
			},
			{
				test: /\.json$/,
				exclude: /(node_modules)/,
				loader: "json"
			},
			{
				test: /\.(jpe?g|png|gif|svg)$/,
				exclude: /(node_modules)/,
				loaders: [ "url", "img" ]
			},
			{
				test: /(pixi|phaser(-split)?|p2)\.js$/,
				loader: "script"
			}
		]
	},
	resolve: {
		alias: {
			"phaser": phaser,
			"pixi.js": pixi,
			"p2": p2,
		}
	},
	plugins: [
		new ExtractTextPlugin("styles.css")
	]
};
