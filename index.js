var phantom = require('phantom');

phantom.create(function (p) {

	return p.createPage(function (page) {

		return page.open('http://google.com', function (status) {

			console.log('opened google :: ', status);
			return page.evaluate(
				function () { return document.title; },
				function (result) {
					console.log('Page title is ' + result);
					return p.exit();
				});
		});
	});
});