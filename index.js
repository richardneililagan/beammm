var server = require('./app/server');
server.init(
    process.env.PORT || 8080
    );