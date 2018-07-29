const express = require('express');
const router = express.Router();

const ho = require("./httpOutput");
const md5 = require("md5");
const uuid = require("uuid");

router.use("*",(req,res,next)=>{
    if(req.method=="OPTIONS"){
        req.end();
    }else{
        if(req.headers["token"]){            
            var token=req.headers["token"];       
            pool.getConnection(function(err,connection){
                if(err){
                    console.log("数据库连接失败！")
                }else{
                    connection.query('select * from users where token=?',token,function(err,result){
                        if (err) {
                            ho(res,ho.status.e401);
                            console.log(err)
                            console.log("查询token失败")
                        } else {
                            console.log("查询token成功")
                           next();
                        }
                        connection.release();
                    });
                }
            });
        }else{
            ho(res,ho.status.e401);
        }
    }
});
module.exports=router;