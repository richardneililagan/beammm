
var _ = require('underscore'),
	BaseController = require('./basecontroller').BaseController
	;

var Controller = function () {

	this.methods = {
		get : {
			search : this.handler(function (req, res, next) {


				next();

			}, ['searchstring'])
		}
	};
};

require('util').inherits(Controller, BaseController);

module.exports = {
	create : function () {
		return new Controller();
	}
};