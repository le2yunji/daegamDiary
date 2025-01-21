const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const webpackMode = process.env.NODE_ENV || 'development';

module.exports = {
	mode: webpackMode,
	entry: {
		main: path.resolve(__dirname, 'src/js/main.js'),
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].min.js',
	},
	stats: {
        errorDetails: true,  // 오류 세부 정보 출력
        children: true,      // 하위 모듈 오류 포함
    },
	devServer: {
		liveReload: true,
		static: {
			directory: path.resolve(__dirname, 'dist'),
		},
		compress: true,
		port: 8080,
		hot: true
	},
	optimization: {
		minimizer: webpackMode === 'production' ? [
			new TerserPlugin({
				terserOptions: {
					compress: {
						drop_console: true
					}
				}
			})
		] : [],
		splitChunks: {
			chunks: 'all'
		}
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules/
			},
			{
				test: /\.js$/,
				enforce: 'pre',
				use: ['source-map-loader'],
			},
			{
				test: /\.(png|jpg|jpeg|gif|svg)$/i,
				type: 'asset/resource',  // Webpack 5 기본 설정 사용
				generator: {
					filename: 'images/[name][ext]',  // 빌드 시 이미지 경로 지정
				},
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, 'src/index.html'),
			minify: process.env.NODE_ENV === 'production' ? {
				collapseWhitespace: true,
				removeComments: true,
			} : false
		}),
		new CleanWebpackPlugin(),
		new CopyWebpackPlugin({
			patterns: [
				{ from: path.resolve(__dirname, 'src/styles/main.css'), to: './main.css' },
				{ from: path.resolve(__dirname, 'src/assets/images'), to: './images' },
				{ from: path.resolve(__dirname, 'src/assets/models'), to: './models' },
			],
		})
	]
};
