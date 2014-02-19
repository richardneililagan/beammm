var _ = require('underscore'),
	BaseController = require('./handlers/basecontroller').BaseController
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
			contract = handler instanceof BaseController && handler.contract()
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

				if (!_.isFunction(fn)) {
					return;
				}

				var params = fn.params || [];

				var patharray = [opts.root, name];
				_.each(params, function (val) {
					_.isString(val) && patharray.push(':' + val.replace(' ', '-'));
				});

				var path = patharray.join('/');

				console.log(
					'mapping route',
					method.toUpperCase(),
					path
					);

				router(path, _.bind(fn, handler));
			});
		});
	}
};