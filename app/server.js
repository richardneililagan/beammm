
var restify = require('restify'),
    config = require('../config.json'),
    _ = require('underscore'),
    LoaderFactory = require('./loader-clean.js')
    ;

var server = restify.createServer(
    _.defaults(
        {
            // TODO
        },
        config.server
    )
);

console.log('server starting.');

// makes the query string accessible via [request.query]
server.use(restify.queryParser());

// TODO pre middleware here

require('./routes').registerRoutes(server);

module.exports = {
    init : function (port, ip) {
        server.listen(port, ip, function () {
            console.log('server listening at port', port);
            LoaderFactory.init(port).on('initialized', function () {
                console.log('LoaderFactory initialized.');
            });
        });
    }
};