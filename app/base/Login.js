const ho = require("./httpOutput");
const express = require('express');
const router = express.Router();
const uuid = require("uuid");
const md5 = require("md5");
var mysql = require('mysql');


pool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    database: 'test',
    user: 'root',
    password: 'lois111'
})
//登录
router.post("/login", (req, res, next) => {
    var username = req.body.username;
    var password = md5(req.body.password); 
    pool.getConnection(function (err, connection) {
        if (err) {
            console.log("数据库连接失败！")
            console.log(err)
        } else {
            var str='select * from users where username='+username+' and password='+password;
            connection.query('select * from users where username=? and password=?',[username,password],
                function (err, result) {
                    if (err||result==undefined||result.length==0) {
                        console.log("用户查询失败")
                        ho(res, ho.status.e500, err);
                    } else {
                        var token = uuid();
                        console.log("用户查询成功")                                   
                        connection.query('update users set token=? where username=?',[token,username],
                        function(err,result){
                            if (!err) {
                                var userId="";
                                connection.query('select id from users where username=?',username,
                                function(err,id){
                                    if (!err) {
                                        ho(res, ho.status.ok, { userId: id, token: token }); 
                                    } else {
                                        ho(res, ho.status.e500, err);
                                    }
                                    connection.release();
                                });
                            } else {
                                ho(res, ho.status.e500, err);
                            }
                        });
                       
                    }
                }
            )
        }
    });

});

module.exports = router;