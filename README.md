See: https://github.com/webpack-contrib/html-loader/issues/405

This repository is intended to demonstrate a possible bug (or documentation error) when using `html-loader` and extending the default sources with a custom `option.sources.list`.

# Documentation
According to the [README](https://github.com/webpack-contrib/html-loader#sources), the documentation for `options.sources.list` makes the following two statements:

> Using `"..."` syntax allows you to extend default supported tags and attributes.

and...

> If the tag name is not specified it will process all the tags.

This implies that the two loader configs below *should* be equivalent:

```html
<html>
	<body>
		<img my-custom-src="./puppy.jpeg">
	</body>
</html>
```

```js
// Version 1: Without `tag'
options: {
	sources: {
		list: [
			"...",
			{ attribute: "my-custom-src", type: "src" }
		]
	}
```
```js
// Version 2: With `tag`
options: {
	sources: {
		list: [
			"...",
			{ tag: "img", attribute: "my-custom-src", type: "src" }
		]
	}
```

# Expected result
According to the documentation, both of the configs above *should* process the `my-custom-src` attribute of the `<img>` tag, and the cute puppy image should be included in the final bundle.

# Actual result
When `tag: "img"` is not specified, the custom attribute is **not** processed.

When `tag: "img"` is specified, the custom attribute is processed.

# But isn't there already a test for this?
I looked at the tests, and sure enough there *is* an [existing test](https://github.com/webpack-contrib/html-loader/blob/master/test/sources-option.test.js#L290) for:
```js
it("should handle all src sources in all HTML tags when tag is undefined")
```

However, what I discovered is that this test doesn't use the `"..."` option to extend the default sources.

In fact, all existing tests that do use `"..."` also explicitly specify a `tag` for the overrides.

There are no tests where `"..."` is specified and a custom attribute without a `tag` is used.

If we remove `"..."` from our config, then both versions of the config do work as expected.

# Steps to reproduce
1. Clone this repository (`git clone https://github.com/scottohara/webpack-html-loader-custom-source.git`)
2. Change into the directory (`cd webpack-html-loader-custom-source`)
3. Install dependencies (`npm install`)
4. Bundle (`webpack`)
5. Inspect the contents of `/dist` and note the following:
	* There is no `*.jpeg` file present
	* The `index.html` module in `main.js` still has the original `<img my-custom-src="./puppy.jpeg">` markup
	* The `console.log()` statement in the `filter()` does not appear anywhere in the CLI output
6. Uncomment `tag: "img"` (line 20 in `webpack.config.js`)
7. Bundle (`webpack`)
8. Inspect the contents of `/dist` and note the following:
	* There is a `*.jpeg` file present
	* There is a `puppy.jpeg` module in the `main.js` bundle
	* The `index.html` module in `main.js` now loads the `puppy.jpeg` module
	* The `console.log()` statement in the `filter()` appears in the CLI output
9. Remove the `"..."` (line 18 in `webpack.config.js`)
10. Repeat steps 4-8 (with/without `tag: "img"`), and obverse that both work as expected.

# Conclusion
Either:
1. The `README` should be updated to indicate that if `"..."` is used, `tag` must be specified, or
2. The code should be fixed to allow `tag` to be omitted when using `"..."`