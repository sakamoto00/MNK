/**
 * Coder: Sean
 * Date: 14-7-12
 * Time: ÏÂÎç6:51
 */
var  mongodb = require('mongodb');
var  server  = new mongodb.Server('localhost', 27017, {auto_reconnect:true});
var  dbConn = new mongodb.Db('mnk', server, {safe:true});

var userExist = function(user, pwd, callBack){
    //Á¬½Ódb
    dbConn.open(function(err, db){
        if(!err){
            db.createCollection('user', {safe:true}, function(err, collection){
                if(!err){
                    collection.findOne({username: user, password:pwd}, function(err, item) {
                        if(!err){
                            if(item){
                                callBack(true);
                            }else{
                                callBack(false);
                            }
                        }else{
                            callBack(false, err);
                        }
                        dbConn.close();
                    })
                }else{
                    callBack(false, err);
                    dbConn.close();
                }
            });
        }else{
            callBack(false, err);
            dbConn.close();
        }
    });

};

module.exports = userExist;