
var sd = require('silly-datetime');
const ho = require("../base/httpOutput");
const express = require('express');
const router = express.Router();

var createModal = 'CREATE TABLE IF NOT EXISTS comment(id int NOT NULL AUTO_INCREMENT PRIMARY KEY,'
    + 'comment_text text,reply int DEFAULT 0 NOT NULL,time text,praise int DEFAULT 0 NOT NULL,userId int,content_id int,video_id int)';

router.get("/list_content", (req, res, next) => {
    var id = req.query.id;
    console.log("查询")

    pool.getConnection(function (err, connection) {
        if (err) {
            res.send("数据库连接失败！");
            console.log("数据库连接失败！");
        } else {          
           var str='select a.*,b.username,b.userImage from comment a inner join users b on a.userId = b.id where a.content_id=? order by a.id desc limit 1 offset 0';
             connection.query(str,id,
         
                function (err, result) {
                    if (err) {
                        ho(res, ho.status.e500, err);
                        console.log("查询数据失败")
                        
                    } else {
                        ho(res, ho.status.ok, result);
                        console.log("查询数据成功")
                        console.log(result);
                    }
                    connection.release();
                });
        }
    });
});
router.get("/list_video", (req, res, next) => {
    var id = req.query.id;
    console.log("查询")

    pool.getConnection(function (err, connection) {
        if (err) {
            res.send("数据库连接失败！");
            console.log("数据库连接失败！");
        } else {          
           
             connection.query("select a.*,b.username,b.userImage from comment a inner join users b on a.userId = b.id where a.video_id=? order by a.id desc limit 1 offset 0",id,
         
                function (err, result) {
                    if (err) {
                        ho(res, ho.status.e500, err);
                        console.log("查询数据失败")
                        
                    } else {
                        ho(res, ho.status.ok, result);
                        console.log("查询数据成功")
                        console.log(result);
                    }
                    connection.release();
                });
        }
    });
});
//分页的
router.get("/page_content", (req, res, next) => {
    var id = req.query.id;
    var current_page=req.query.current_page;
    var num=req.query.num;
    pool.getConnection(function (err, connection) {
        if (err) {
            res.send("数据库连接失败！");
            console.log("数据库连接失败！");
        } else {          
            var str='select a.*,b.username,b.userImage from comment a inner join users b on a.userId = b.id where a.content_id=? order by a.id desc limit '+num+' offset '+num*(current_page-1);
             connection.query(str,id,
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
//分页的
router.get("/page_video", (req, res, next) => {
    var id = req.query.id;
    var current_page=req.query.current_page;
    var num=req.query.num;
    pool.getConnection(function (err, connection) {
        if (err) {
            res.send("数据库连接失败！");
            console.log("数据库连接失败！");
        } else {          
            var str='select a.*,b.username,b.userImage from comment a inner join users b on a.userId = b.id where a.video_id=? order by a.id desc limit '+num+' offset '+num*(current_page-1);
             connection.query(str,id,
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
            connection.query('insert into comment set?',
                {
                    comment_text: req.body.comment_text, time:time, userId: req.body.userId,content_id:req.body.content_id,video_id:req.body.video_id
                    
                },
                function (err, result) {
                    if (err) {
                        ho(res, ho.status.e500);
                        console.log("添加内容失败")
                    } else {
                        ho(res, ho.status.ok);
                        console.log("添加内容成功")
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
            connection.query('delete from comment where id in(?)', id, function (err, result) {
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
router.post("/update_praise", (req, res, next) => {
    var id = req.body.id;
    var praise=(req.body.praise)+1;
    pool.getConnection(function (err, connection) {
        if (err) {
            res.send("数据库连接失败！");
            console.log("数据库连接失败！")
        } else {
            connection.query('update comment set praise=praise+1 where id=?',id, function (err, result) {
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
router.post("/update_reply", (req, res, next) => {
    var id = req.body.id;
    var reply=req.body.reply;
    pool.getConnection(function (err, connection) {
        if (err) {
            res.send("数据库连接失败！");
            console.log("数据库连接失败！")
        } else {
            connection.query('update comment set reply=reply+1 where id=?',id, function (err, result) {
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