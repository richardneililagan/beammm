var loader = require('./app/loader').create();

loader.on('loaded', function (response) {

	console.log(response.html());
});

loader.load('http://thepiratebay.se/search/nausicaa/');