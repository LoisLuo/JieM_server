

const ho = require("../base/httpOutput");
const express = require('express');
const router = express.Router();
const uuid = require("uuid");
const md5 = require("md5");

//praise，reply，用来设置用户消息的，别人对自己的点赞和回复
var createModal = 'CREATE TABLE IF NOT EXISTS users(id int NOT NULL AUTO_INCREMENT PRIMARY KEY,'
    + 'username varchar(255),password varchar(255),userImage text,sort text,browse text,token text,praise int DEFAULT 0 NOT NULL,reply int DEFAULT 0 NOT NULL)';


    router.get("/list", (req, res, next) => {
        var current_page=req.query.pageNumber;
        var num=req.query.pageSize;
        pool.getConnection(function (err, connection) {
            if (err) {
                res.send("数据库连接失败！");
                console.log("数据库连接失败！");
            } else {
                connection.query(createModal,function(err,result){
                    if(err){
                        console.log("数据表创建失败")
                   }else{
                    console.log("分类表创建成功");                 
                   }              
                });
                str='select count(*) count from users';
                connection.query(str,function (err, count) {
                        if (err) {
                            console.log(err);
                        } else {
                            str='select a.id,a.username from users a order by id desc limit '+num+' offset '+num*(current_page-1);
                            connection.query(str,function (err, result) {
                                    if (err) {
                                        console.log(err);
                                        ho(res, ho.status.e500, err);
                                    } else {
                                        ho(res, ho.status.ok, {result:result,count:count});
                                    }
                                    connection.release();
                                });
    
                        }
                    });
            }
        });
    });
router.get("/user_msg", (req, res, next) => {
    var userId=req.query.userId
    var current_page=req.query.current_page;
    var num=req.query.num;
    pool.getConnection(function (err, connection) {
        if (err) {
            res.send("数据库连接失败！");
            console.log("数据库连接失败！");
        } else {
           
            var str='select a.id as msgId,a.time,a.reply_text,b.username,d.title,'
            +'d.id as content_id from reply a left join users b on a.userId=b.id left join comment c on a.commentId=c.id left join content d on c.content_id=d.id where a.commentUserId='+userId
            +' UNION select e.id as msgId,e.time,e.reply_text,b.username,d.title,'
            +'d.id as content_id from praise e left join users b on e.userId=b.id left join comment c on e.commentId=c.id left join content d on c.content_id=d.id where e.commentUserId='+userId
            +' and d.id is not null ORDER BY time desc limit '+num+' offset '+num*(current_page-1);
            connection.query(str,
                function (err, result) {
                    if (err) {
                        ho(res, ho.status.e500, err);
                        console.log(err);
                    } else {
                        ho(res, ho.status.ok, result);
                    }
                    connection.release();
                });
        }
    });
});
router.get("/getone", (req, res, next) => {
    var id = req.query.id;
    console.log("查询")

    pool.getConnection(function (err, connection) {
        if (err) {
            res.send("数据库连接失败！");
            console.log("数据库连接失败！");
        } else {
            connection.query("select * from users where id=?", id,
                function (err, result) {
                    if (err) {
                        ho(res, ho.status.e500, err);
                        console.log("查询数据失败")
                    } else {
                        ho(res, ho.status.ok, result);
                        console.log("查询数据成功")
                    }
                    connection.release();
                });
        }
    });
});

router.post("/create", (req, res, next) => {
    var password = md5(req.body.password);
    pool.getConnection(function (err, connection) {
        if (err) {
            res.send("数据库连接失败！");
        } else {
            connection.query(createModal, function (err, result) {
                if (err) {
                    console.log(err)
                    console.log("users创建失败")
                } else {
                    console.log("数据表创建成功");
                }
            });
            connection.query('insert into users set?',
                {
                    username: req.body.username, password: password,userImage:null,sort:null,browse:null,token:null,praise:0,reply:0
                },
                function (err, result) {
                    if (err) {
                        ho(res, ho.status.e500, err);
                    } else {
                        ho(res, ho.status.ok);
                        
                    }
                    connection.release();

                });
        }
    });
});
router.post("/remove", (req, res, next) => {
    var id = req.body.ids;
    console.log(id);
    pool.getConnection(function (err, connection) {
        if (err) {
            res.send("数据库连接失败！");
            console.log("数据库连接失败！")
        } else {
            var str;
            connection.query( 'delete from users where id in(' +id+')', function (err, result) {
                if (err) {
                    ho(res, ho.status.e500, err);
                    console.log(err)
                } else {
                    ho(res, ho.status.ok, result);
                }
                connection.release();
            });
        }
    });
});
router.post("/update", (req, res, next) => {
    var id = req.body.id;
    pool.getConnection(function (err, connection) {
        if (err) {
            res.send("数据库连接失败！");
            console.log("数据库连接失败！")
        } else {
            var str;
            var al = req.body;
            connection.query('update users set * where id=?', [id], function (err, result) {
                if (err) {
                    ho(res, ho.status.e500, err);
                    console.log(err)
                    console.log("更新数据失败")
                } else {
                    ho(res, ho.status.ok, result);
                    console.log("更新数据成功")
                }
                connection.release();
            });
        }
    });
});
router.post("/update_img", (req, res, next) => {
    var id = req.body.id;
    var titleImage=req.body.titleImage;
    console.log(titleImage)
    pool.getConnection(function (err, connection) {
        if (err) {
            res.send("数据库连接失败！");
            console.log("数据库连接失败！")
        } else {
            var str;
            var al = req.body;
           
            connection.query('update users set userImage=? where id=?', [titleImage,id], function (err, result) {
                if (err) {
                    ho(res, ho.status.e500, err);
                    console.log(err)
                    console.log("更新数据失败")
                } else {
                    ho(res, ho.status.ok, result);
                    console.log("更新数据成功")
                }
                connection.release();
            });
        }
    });
});

module.exports = router;