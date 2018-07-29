var sd = require('silly-datetime');
const ho = require("../base/httpOutput");
const express = require('express');
const router = express.Router();

var createModal = 'CREATE TABLE IF NOT EXISTS praise(id int NOT NULL AUTO_INCREMENT PRIMARY KEY,'
    + 'time text,userId int,commentId int,commentUserId int,reply_text int DEFAULT 0 NOT NULL)';

router.get("/list", (req, res, next) => {
    pool.getConnection(function (err, connection) {
        if (err) {
            res.send("数据库连接失败！");
            console.log("数据库连接失败！");
        } else {
            connection.query("select * from praise order by id",
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
            connection.query('insert into praise set?',
                {
                     time:time, userId: req.body.userId,commentId:req.body.commentId,commentUserId:req.body.commentUserId
                    
                },
                function (err, result) {
                    if (err) {
                        ho(res, ho.status.e500);
                        console.log(err)
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
            var str='delete from praise where id in('+id+')';
            connection.query(str, function (err, result) {
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

module.exports = router;