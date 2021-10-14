module.exports = {
	mode: "development",
	output: {
		clean: true
	},
	module: {
		rules: [
			{
				test: /\.jpeg$/u,
				type: "asset/resource"
			},
			{
				test: /\.html$/u,
				loader: "html-loader",
				options: {
					sources: {
						list: [
							"...",
							{
								//tag: "img",
								attribute: "my-custom-src",
								type: "src",
								filter(tag, attribute, attributes, resourcePath) {
									console.log(tag, attribute, attributes, resourcePath);
									return true;
								}
							}
						]
					}
				}
			}
		]
	}
};