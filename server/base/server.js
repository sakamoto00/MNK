/**
 * Coder: Sean
 * Date: 14-7-12
 * Time: ÉÏÎç11:50
 */
var http = require('http');
var url = require('url');
var querystring = require("querystring");
function start(route,handle){
    function onRequest(request,response){
        var url_array = url.parse(request.url,true);
        var pathname = url_array.pathname;
        var query_param = url_array.query;

        route(handle, pathname, response, query_param);
    }
    http.createServer(onRequest).listen(3000);
    console.log("Server has started. listen:3000");
}
exports.start = start;