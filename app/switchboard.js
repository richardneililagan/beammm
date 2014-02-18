var _ = require('underscore'),
	BaseHandler = require('./handlers/basehandler').BaseHandler
	;

var parsefilename = function (alias, version) {

	return './handlers/' + [
		alias,
		version.split('.').join('-')
	].join('-');
};

module.exports = {

	connect : function (server, opts) {

		var filename = parsefilename(opts.alias, opts.version),
			handler = require(filename).create(),
			contract = handler instanceof BaseHandler && handler.contract()
			;

		console.log('contract found for [', filename, ']');

		_.each(contract, function (map, method) {

			var router = _.bind(server[method.toLowerCase()], server);

			// failsafe
			if (!_.isFunction(router)) {
				return;
			}

			// append route maps to the server
			// based on this handler's contract
			_.each(map, function (fn, name) {

				var path = [opts.root, name].join('/');
				if (!_.isFunction(fn)) {
					return;
				}

				console.log(
					'mapping route',
					method.toUpperCase(),
					[opts.root, name].join('/')
					);

				router([opts.root, name].join('/'), fn);
			});
		});
	}
};