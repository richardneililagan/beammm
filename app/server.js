
var restify = require('restify'),
	config = require('../config.json'),
	_ = require('underscore')
	;

var server = restify.createServer(_.defaults({

	}, config.server));