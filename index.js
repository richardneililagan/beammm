var server = require('./app/server');
server.init(
    process.env.OPENSHIFT_NODEJS_PORT || 8080,
    process.env.OPENSHIFT_NODEJS_IP || 127.0.0.1
    );