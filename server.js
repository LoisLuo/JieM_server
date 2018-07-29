var express = require('express');
var path = require('path');
const nextJS = require('next')
const dev = process.env.NODE_ENV !== 'production'
const next = nextJS({ dev });
global.next = next;
var mysql = require('mysql');
var bodyParser = require('body-parser');
const admin = require('./app/admin');
const client = require('./app/client');
const ueditorServer = require('./ueditorServer');

var lib = require('./app/component/addBook')

pool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    database: 'test',
    user: 'root',
    password: 'lois111'
})

// const models = path.join(__dirname, config.modelPath);


// fs.readdirSync(models)
//     .filter(file => {
//         return ~file.indexOf('.js');
//     }).forEach(file => {
//         console.log("引入", path.join(models, file));
//         require(path.join(models, file))
//     });

next.prepare()
    .then(() => {
        const server = express();
         // 添加 body-parser 中间件就可以了
         server.use(bodyParser.urlencoded({ extended: false }));
         server.use(bodyParser.json());
        //注册静态目录
        server.use(express.static(path.join(__dirname, 'public')));
        server.use(express.static(path.join(__dirname, 'static')));

        server.all("*", (req, res, next) => {
            console.log(`被访问地址：${req.originalUrl}`);
            //让接口支持跨域请求
            res.header("Access-Control-Allow-Origin", "*"); //设置跨域访问
            //设置请求头可以加传token等字段
            res.header("Access-Control-Allow-Headers", 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , token');
            next();
        });

        server.use(bodyParser.urlencoded({ extended: false }));
        server.use('/admin', admin);
        server.use('/client', client);
        server.use("/ueditor/ue", ueditorServer);

        server.listen(3001,(err) => {
            if (err) throw err
            console.log('> Ready on http://localhost:3001')
        })
    })