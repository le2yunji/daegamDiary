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
		load: path.resolve(__dirname, 'src/js/loading.js'),
		start: path.resolve(__dirname, 'src/js/start.js'),
		main: path.resolve(__dirname, 'src/js/main.js'),
	},
	output: {
		path: path.resolve(__dirname, 'dist'), // 빌드 후 파일이 저장될 경로
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
			},
			// 2. GLTF 모델 파일 로딩
            {
                test: /\.glb$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[hash:8].[ext]',
                            outputPath: 'assets/models/', // 모델 파일이 위치할 디렉토리
                        }
                    }
                ]
            },
            // 3. Draco 압축 파일 로딩
            {
                test: /draco_decoder\.js$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[hash:8].[ext]',
                            outputPath: 'libs/draco/', // Draco 디코더 파일이 위치할 디렉토리
                        }
                    }
                ]
            },
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
