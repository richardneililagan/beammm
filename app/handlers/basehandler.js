
var util = require('util'),
	_ = require('underscore')
	;

var BaseHandler = function () {};

util.inherits(BaseHandler, require('events').EventEmitter);

// ### public
_.extend(BaseHandler.prototype, {

	methods : {
		get : {},
		post : {},
		put : {},
		delete : {}
	},

	execute : function (opts) {

		// set defaults
		_.defaults(opts, {
			verb : 'get',
			method : 'index',
			request : null,
			response : null,
			next : null
		});

		if (this[opts.verb.toLowerCase()] &&
			_.isFunction(this[opts.verb.toLowerCase()][opts.method]))
		{
			this[opts.verb.toLowerCase()][opts.method](
				opts.request,
				opts.response,
				opts.next
				);
		}

	},

	// returns a consumable contract of how this handler can be used
	contract : function () {
		return this.methods;
	}
});

module.exports = {
	BaseHandler : BaseHandler
};