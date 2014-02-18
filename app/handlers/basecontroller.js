
var util = require('util'),
	_ = require('underscore'),
	Loader = require('../loader')
	;

var BaseController = function () {};

util.inherits(BaseController, require('events').EventEmitter);

// ### public
_.extend(BaseController.prototype, {

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
	},

	// convenience function to return an instance of the page loader
	createLoader : function () {
		return Loader.create();
	},

	// creates a function that has properties compatible
	// for constructing dynamic routes
	handler : function (fn, params) {

		var ret = fn;

		// TODO make sure params is either array or string
		ret.params = _.isArray(params) ? params : [params];
		return ret;
	}

});

module.exports = {
	BaseController : BaseController
};