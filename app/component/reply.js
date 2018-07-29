var sd = require('silly-datetime');
const ho = require("../base/httpOutput");
const express = require('express');
const router = express.Router();

var createModal = 'CREATE TABLE IF NOT EXISTS reply(id int NOT NULL AUTO_INCREMENT PRIMARY KEY,'
    + 'reply_text text,time text,userId int,commentId int,commentUserId int)';

router.get("/list", (req, res, next) => {
    
    console.log("获取数据")
    pool.getConnection(function (err, connection) {
        if (err) {
            res.send("数据库连接失败！");
            console.log("数据库连接失败！");
        } else {
          
            connection.query("select a.*,b.username,b.userImage from reply a join users b on a.userId=b.id where a.commentId=?",req.query.id,
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
            connection.query('insert into reply set?',
                {
                    reply_text: req.body.reply_text, time:time, userId: req.body.userId,commentId:req.body.commentId,commentUserId:req.body.commentUserId
                    
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
    pool.getConnection(function (err, connection) {
        if (err) {
            res.send("数据库连接失败！");
            console.log("数据库连接失败！")
        } else {
            var str='delete from reply where id in('+id+')';
            connection.query(str, function (err, result) {
                if (err) {
                    ho(res, ho.status.e500, err);
                    console.log(err)
                } else {
                    ho(res, ho.status.ok, result);
                    console.log("删除数据成功")
                }
                connection.release();
            });
        }
    });
});

module.exports = router;