const express = require('express');
const router = express.Router();
const ho = require("../base/httpOutput");

var createModal = "CREATE TABLE IF NOT EXISTS channel(id int NOT NULL AUTO_INCREMENT PRIMARY KEY,title varchar(255))";
router.get("/admin_con_list", (req, res, next) => {
    pool.getConnection(function (err, connection) {
        if (err) {
            res.send("数据库连接失败！");
            console.log("数据库连接失败！");
        } else {
            str='select a.id,a.title from channel a';
            connection.query(str,function (err, result) {
                if (err) {
                    console.log(err);
                } else {
                ho(res, ho.status.ok, result);
                connection.release();
                }
            });
        }
    });
});
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
                console.log("数据表创建成功");                 
               }              
            });
            str='select count(*) count from channel';
            connection.query(str,function (err, count) {
                    if (err) {
                        console.log(err);
                    } else {
                        str='select a.id,a.title from channel a order by id desc limit '+num+' offset '+num*(current_page-1);
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
router.post("/create",(req,res,next)=>{

    pool.getConnection(function(err,connection){
        if(err){
            res.send("数据库连接失败！");
            console.log("数据库连接失败！")
        }else{
            
            var str;
            connection.query('insert into channel set?',
            {title:req.body.title},
            function(err,result){
                if (err) {
                    ho(res, ho.status.e500, err);
                    console.log("添加频道失败")
                } else {
                    ho(res, ho.status.ok, result);
                    console.log("添加频道成功")
                }
                connection.release();
            });
        }
    });
});
router.post("/remove",(req,res,next)=>{
    var id=req.body.ids;
    console.log(id);
    pool.getConnection(function(err,connection){
        if(err){
            res.send("数据库连接失败！");
            console.log("数据库连接失败！")
        }else{
            var str;
           
            connection.query( 'delete from channel where id in(' +id+')',function(err,result){
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
router.post("/update",(req,res,next)=>{
    var id=req.body.id;
    var title=req.body.title;
    pool.getConnection(function(err,connection){
        if(err){
            res.send("数据库连接失败！");
            console.log("数据库连接失败！")
        }else{
            var str;
            connection.query('update channel set title=? where id=?',[title,id],function(err,result){
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