

const ho = require("../base/httpOutput");
const express = require('express');
const router = express.Router();
var sd = require('silly-datetime');

var createModal = 'CREATE TABLE IF NOT EXISTS video(id int NOT NULL AUTO_INCREMENT PRIMARY KEY,'
    + 'title varchar(255),channel varchar(255),contentText text,sort varchar(255),author varchar(255),'
    + 'titleImage varchar(255),video varchar(255),time varchar(255),clicks int DEFAULT 0 NOT NULL,comment int DEFAULT 0 NOT NULL)';

router.get("/admin_list", (req, res, next) => {
    var current_page = req.query.pageNumber;
    var num = req.query.pageSize;
    pool.getConnection(function (err, connection) {
        if (err) {
            res.send("数据库连接失败！");
            console.log("数据库连接失败！");
        } else {
            connection.query('select count(*) count from video', function (err, count) {
                if (err) {
                    console.log(err);
                    ho(res, ho.status.e500, err);
                } else {
                    connection.query('select * from video order by id desc limit ' + num + ' offset ' + num * (current_page - 1), function (err, result) {
                        if (err) {
                            console.log(err);
                            ho(res, ho.status.e500, err);
                        } else {
                            ho(res, ho.status.ok, {
                                result: result,
                                count: count
                            });

                        }
                        connection.release();
                    });


                }
            });
        }
    });
});
router.get("/homepage_list", (req, res, next) => {
    var current_page=req.query.current_page;
    var num=req.query.num;
    console.log("获取数据")
    pool.getConnection(function (err, connection) {
        if (err) {
            res.send("数据库连接失败！");
            console.log("数据库连接失败！");
        } else {
          var str='select a.id,a.title,a.titleImage,a.time,a.clicks,a.comment from video a order by id desc limit '+num+' offset '+num*(current_page-1);
            connection.query(str,
                function (err, result) {
                    if (err) {
                        ho(res, ho.status.e500, err);
                    } else {
                        ho(res, ho.status.ok, result);
                    }
                    connection.release();
                });
        }
    });
});

//推送
router.get("/recommend", (req, res, next) => {
    var id = req.query.id;
    var str=req.query.sort;
    var s=str.split(",");
    var sort=s[0];

    pool.getConnection(function (err, connection) {
        if (err) {
            res.send("数据库连接失败！");
            console.log("数据库连接失败！");
        } else {       
            connection.query("select * from video where sort like '%"+sort+"%' order by id desc limit 3 offset 0",
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
router.get("/getone", (req, res, next) => {
    var id = req.query.id;
    console.log("查询")

    pool.getConnection(function (err, connection) {
        if (err) {
            res.send("数据库连接失败！");
            console.log("数据库连接失败！");
        } else {            
            connection.query("select * from video where id=?",id,
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
                    console.log("video创建失败")
                } else {
                    console.log("video创建成功");
                }
            });
            connection.query('insert into video set?',
                {
                    title: req.body.title, channel: req.body.channel, sort: req.body.sort,contentText: req.body.contentText,
                    author: req.body.author, time:time, video: req.body.video,titleImage:req.body.titleImage,clicks:0,comment:0
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
    console.log(id);
    pool.getConnection(function (err, connection) {
        if (err) {
            res.send("数据库连接失败！");
            console.log("数据库连接失败！")
        } else {
            var str;
           
            connection.query( 'delete from video where id in(' +id+')', function (err, result) {
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
            connection.query('update video set * where id=?', [al, id], function (err, result) {
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
//更新被点击量
router.post("/update_clicks", (req, res, next) => {
    var id = req.body.id;
    pool.getConnection(function (err, connection) {
        if (err) {
            res.send("数据库连接失败！");
            console.log("数据库连接失败！")
        } else {
            var str;
            var al = req.body;
            connection.query('update video set clicks=clicks+1 where id=?', id, function (err, result) {
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
//更新评论
router.post("/update_comment", (req, res, next) => {
    var id = req.body.id;
    pool.getConnection(function (err, connection) {
        if (err) {
            res.send("数据库连接失败！");
            console.log("数据库连接失败！")
        } else {
            var str;
            var al = req.body;
            connection.query('update video set comment=comment+1 where id=?', id, function (err, result) {
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

/*******app*************/
router.get("/applist", (req, res, next) => {
    var current_page=req.query.current_page;
    var num=req.query.num;
    console.log("获取数据")
    pool.getConnection(function (err, connection) {
        if (err) {
            res.send("数据库连接失败！");
            console.log("数据库连接失败！");
        } else {
          var str='select a.id,a.title,a.video,a.time,a.clicks,a.comment from video a order by id desc limit '+num+' offset '+num*(current_page-1);
            connection.query(str,
                function (err, result) {
                    if (err) {
                        ho(res, ho.status.e500, err);
                    } else {
                        ho(res, ho.status.ok, result);
                   

                    }
                    connection.release();
                });
        }
    });
});
module.exports = router;