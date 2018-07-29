

const ho = require("../base/httpOutput");
const express = require('express');
const router = express.Router();
var sd = require('silly-datetime');

var createModal = 'CREATE TABLE IF NOT EXISTS isEmergencies(id int NOT NULL AUTO_INCREMENT PRIMARY KEY,'
    + 'title varchar(255),channel varchar(255),sort varchar(255),author varchar(255),'
    + 'contentText text,time varchar(255),clicks int DEFAULT 0 NOT NULL,comment int DEFAULT 0 NOT NULL)';

//前台获取快讯信息
router.get("/list", (req, res, next) => {
    var current_page=1;
    var num=5;
    var channel=req.query.channel;
    pool.getConnection(function (err, connection) {
        if (err) {
            res.send("数据库连接失败！");
            console.log("数据库连接失败！");
        } else {
             
             var str='select a.id,a.title,a.time from isEmergencies a where channel=? order by id desc limit '+num+' offset '+num*(current_page-1);           
            connection.query(str,channel,function (err, result) {
                    if (err) {
                        console.log(err);
                        ho(res, ho.status.e500, err);
                    } else {
                        ho(res, ho.status.ok, result);
                    }
                    connection.release();
                });
        }
    });
});
//前台首页获取快讯信息
router.get("/home_list", (req, res, next) => {
    var current_page=1;
    var num=5;
    var channel=req.query.channel;
    pool.getConnection(function (err, connection) {
        if (err) {
            res.send("数据库连接失败！");
            console.log("数据库连接失败！");
        } else {
            var str='select a1.title,a1.time,a1.id from isEmergencies a1 inner join (select a.title,'
                +'a.id,a.channel from isEmergencies a left join isEmergencies b on a.channel=b.channel and a.id<=b.id group by a.id,'
                +'a.channel having count(b.channel)<=1)b1 on a1.channel=b1.channel and a1.id=b1.id order by a1.channel,a1.id desc';
            connection.query(str,function (err, result) {
                    if (err) {
                        console.log(err);
                        ho(res, ho.status.e500, err);
                    } else {
                        ho(res, ho.status.ok, result);
                    }
                    connection.release();
                });
        }
    });
});


//后台获取信息
router.get("/admin_list", (req, res, next) => {
    var current_page=req.query.pageNumber;
    var num=req.query.pageSize;
    console.log("获取数据")
    pool.getConnection(function (err, connection) {
        if (err) {
            res.send("数据库连接失败！");
            console.log("数据库连接失败！");
        } else {
            str='select count(*) count from isEmergencies';
            connection.query(str,function (err, count) {
                    if (err) {
                        console.log(err);
                    } else {
                        str='select a.id,a.title,a.channel,a.time from isEmergencies a order by id desc limit '+num+' offset '+num*(current_page-1);
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


//得到一条数据
router.get("/getone", (req, res, next) => {
    var id = req.query.id;
    console.log("查询")

    pool.getConnection(function (err, connection) {
        if (err) {
            res.send("数据库连接失败！");
            console.log("数据库连接失败！");
        } else {            
            connection.query("select * from isEmergencies where id=?",id,
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
    var time=sd.format(new Date(),'YYYY-MM-DD HH:mm:ss');
    pool.getConnection(function (err, connection) {
        if (err) {
            res.send("数据库连接失败！");
        } else {
            connection.query(createModal, function (err, result) {
                if (err) {
                    console.log(err)
                    console.log("content创建失败")
                } else {
                    console.log("数据表创建成功");
                }
            });
            var str;
            connection.query('insert into isEmergencies set?',
                {
                    title: req.body.title, channel: req.body.channel, sort: req.body.sort,
                    author: req.body.author, time: time,contentText: req.body.contentText,clicks:0,comment:0
                },
                function (err, result) {
                    if (err) {
                        str = err;
                    } else {
                        str = "添加内容成功！";
                    }
                    connection.release();
                    res.send(str);
                });
        }
    });
});
router.post("/remove", (req, res, next) => {
    var id = req.body.ids;
    pool.getConnection(function (err, connection) {
        if (err) {
            res.send("数据库连接失败！");
            console.log("数据库连接失败！")
        } else {
            var str;
           
            connection.query( 'delete from isEmergencies where id in(' +id+')', function (err, result) {
                if (err) {
                    ho(res, ho.status.e500, err);
                    console.log(err)
                    console.log("删除数据失败")
                } else {
                    ho(res, ho.status.ok, result);
                    console.log("删除数据成功")
                }
                connection.release();
            });
        }
    });
});
router.post("/update", (req, res, next) => {
    var id = req.body.id;
    var al = req.body;
    pool.getConnection(function (err, connection) {
        if (err) {
            res.send("数据库连接失败！");
            console.log("数据库连接失败！")
        } else {
            var str;
    var al = req.body;
            connection.query('update isEmergencies set * where id=?', [al, id], function (err, result) {
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
//更新文章被点击量
router.post("/update_clicks", (req, res, next) => {
    var id = req.body.id;
    pool.getConnection(function (err, connection) {
        if (err) {
            res.send("数据库连接失败！");
            console.log("数据库连接失败！")
        } else {
            var str;
            var al = req.body;
            connection.query('update isEmergencies set clicks=clicks+1 where id=?', id, function (err, result) {
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
//更新文章评论
router.post("/update_comment", (req, res, next) => {
    var id = req.body.id;
    var comment = req.body.comment;
    pool.getConnection(function (err, connection) {
        if (err) {
            res.send("数据库连接失败！");
            console.log("数据库连接失败！")
        } else {
            var str;
            var al = req.body;
            connection.query('update isEmergencies set comment=? where id=?', [comment, id], function (err, result) {
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