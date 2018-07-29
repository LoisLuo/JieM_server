


const express = require('express');
const router = express.Router();

var createBook="CREATE TABLE IF NOT EXISTS book(id int NOT NULL AUTO_INCREMENT PRIMARY KEY,bookname varchar(255),author varchar(255),price int,titleImage varchar(255),contentText varchar(255))";
router.post("/addbook",(req,res,next)=>{

    pool.getConnection(function(err,connection){
        if(err){
            res.send("数据库连接失败！");
        }else{
            
            connection.query(createBook,function(err,result){
                if(err){
                    console.log("数据表创建失败")
               }else{
                console.log("数据表创建成功");
                 
               }
              
             
            });
            console.log(req.body)
            // console.log(createBook)
            var str;
            connection.query('insert into book set?',
            {bookname:req.body.bookname,author:req.body.author,price:req.body.price,titleImage:req.body.titleImage,contentText:req.body.contentText},
            function(err,result){
                if(err){
                     str=err;
                }else{
                     str="添加书籍成功！";
                }
                connection.release();
                res.send(str);
                console.log(str);
            });
        }
    });
});

module.exports = router;