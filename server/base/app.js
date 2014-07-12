/**
 * Coder: Sean
 * Date: 14-7-12
 * Time: ÉÏÎç9:53
 */
var server = require('./server');
var router = require('./router');
var requestHandlers = require('./requestHandlers');
var handle = {};
handle["/"] = requestHandlers.start;
server.start(router.route,handle);