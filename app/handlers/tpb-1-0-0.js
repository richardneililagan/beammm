
var _ = require('underscore'),
	BaseHandler = require('./basehandler').BaseHandler
	;

var Handler = function () {

	this.methods = {
		get : {
			user : function (req, res, next) {

				res.send('hello world!');
				next();
			}
		}
	};
};

require('util').inherits(Handler, BaseHandler);

module.exports = {
	create : function () {
		return new Handler();
	}
};