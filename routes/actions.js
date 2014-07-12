/**
 * Coder: Sean
 * Date: 14-7-12
 * Time: 下午7:49
 */
var express = require('express');
var router = express.Router();
var http = require('http');
var url = require('url');
var db = require('../server/db');

/**
 * 所有请求处理中心
 */
router.get('/', function(req, res) {
    var arg = url.parse(req.url, true).query;
    if(arg && arg.cmd){
        switch (arg.cmd){
            case 'login':
                //用户验证
                db(arg.username,arg.password, function(result, err){
                    if(err){
                        res.render('error', {
                            message: err.message,
                            error: err
                        });
                    }else{
                        var re = {success: false};
                        if(result){
                            re.success = true;
                        }
                        res.write(JSON.stringify(re));
                        res.end();
                    }
                });
                break;
            default : break;
        }
    }
});

module.exports = router;
