/**
 * Coder: Sean
 * Date: 14-7-12
 * Time: ����7:49
 */
var express = require('express');
var router = express.Router();
var http = require('http');
var url = require('url');
var db = require('../server/db');

/**
 * ��������������
 */
router.get('/', function(req, res) {
    var arg = url.parse(req.url, true).query;
    if(arg && arg.cmd){
        switch (arg.cmd){
            case 'login':
                //�û���֤
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
