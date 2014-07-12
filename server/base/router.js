/**
 * Coder: Sean
 * Date: 14-7-12
 * Time: ионГ11:51
 */
function route(handle,pathname, response, query_param){
    if(typeof handle[pathname] === "function"){
        return handle[pathname](response, query_param);
    }else{
        response.writeHead(404, {"Content-Type": "text/plain"});
        response.write("404 Not found");
        response.end();
    }
}
exports.route = route;