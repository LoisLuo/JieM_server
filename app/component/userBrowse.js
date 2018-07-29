var sd = require('silly-datetime');
const ho = require("../base/httpOutput");
const express = require('express');
const router = express.Router();

var createModal = 'CREATE TABLE IF NOT EXISTS UserBrowse(id int NOT NULL AUTO_INCREMENT PRIMARY KEY,'
    + 'time text,userId int,contentId int,videoId int,isEmgId int)';

router.get("/list", (req, res, next) => {
    var userId=req.query.userId;
    var current_page=req.query.current_page;
    var num=req.query.num;
    console.log()
    pool.getConnection(function (err, connection) {
        if (err) {
            res.send("数据库连接失败！");
            console.log("数据库连接失败！");
        } else {
            str="select a.id as browseId,a.contentId,a.videoId,"
            +"a.time,b.title from UserBrowse a LEFT JOIN content b on a.contentId=b.id where userId=? AND b.title is NOT NULL UNION select a.id as browseId,a.contentId,a.videoId,"
            +"a.time,c.title from UserBrowse a LEFT JOIN video c on a.videoId=c.id where userId=? AND c.title is NOT NULL ORDER BY browseId DESC limit "+num+" offset "+num*(current_page-1)
            connection.query(str,[userId,userId,userId],
                function (err, result) {
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
            connection.query('insert into UserBrowse set?',
                {
                   time:time, userId: req.body.userId,contentId:req.body.contentId,videoId:req.body.videoId,isEmgId:req.body.isEmgId
                    
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
    var id = req.body.selectid;
    pool.getConnection(function (err, connection) {
        if (err) {
            res.send("数据库连接失败！");
            console.log("数据库连接失败！")
        } else {
            var str;
            connection.query('delete from UserBrowse where id in(' +id+')', function (err, result) {
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