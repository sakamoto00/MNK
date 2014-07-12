/**
 * Coder: Sean
 * Date: 14-7-12
 * Time: ионГ11:52
 */
var querystring = require("querystring");
var fs = require("fs");
function start(response, query_param){
    fs.readFile(realPath, "binary", function(err, file) {
        if (err) {
            response.writeHead(500, {'Content-Type': 'text/plain'});
            response.end(err);
        } else {
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.write(file, "binary");
            response.end();

        }

    });
}

exports.start = start;
