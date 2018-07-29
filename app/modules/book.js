/*
    管理员模型
*/
const mysql = require("mysql");
//定义文档
const createBook="CREATE TABLE IF NOT EXISTS `book`( `id` INT UNSIGNED AUTO_INCREMENT,"  
" `bookname` VARCHAR(100) NOT NULL,",
" `author` VARCHAR(40) NOT NULL,",
"`price` INT,",
" `titleImage` VARCHAR(255),",
" `contentText` VARCHAR(255),",
" PRIMARY KEY ( `id` )",
")ENGINE=InnoDB DEFAULT CHARSET=utf8;";
mysql.model("manager", manager);
  
   


