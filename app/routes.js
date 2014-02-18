
var _ = require('underscore'),
	manifest = require('./manifest.json'),
	switchboard = require('./switchboard')
	;

module.exports = {

	// @function establishes routes for the restify server
	registerRoutes : function (server) {

		console.log('registering routes.');

		_.each(manifest, function (versions, key) {

			var root = '/api/' + key;

			console.log('processing :: ', root);

			_.each(versions, function (meta, version) {

				console.log('found mapping for API version :: ', version);
				if (meta.disabled) {
					console.log(root, version, ':: DISABLED');
					return;
				}

				switchboard.connect(server, {
					alias : key,
					version : version,
					root : root
				});
			});
		});
	}
};