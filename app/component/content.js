const ho = require("../base/httpOutput");
const express = require('express');
const router = express.Router();
var sd = require('silly-datetime');

var createModal = 'CREATE TABLE IF NOT EXISTS content(id int NOT NULL AUTO_INCREMENT PRIMARY KEY,' +
    'title varchar(255),subTitle text,channel varchar(255),sort varchar(255),author varchar(255),' +
    'titleImage varchar(255),contentText text,time varchar(255),clicks int DEFAULT 0 NOT NULL,comment int DEFAULT 0 NOT NULL)';

router.get("/list", (req, res, next) => {
    var current_page = req.query.current_page;
    var num = req.query.num;
    var channel = req.query.channel;
    pool.getConnection(function (err, connection) {
        if (err) {
            res.send("数据库连接失败！");
            console.log("数据库连接失败！");
        } else {
            var str = 'select * from content where channel=? order by id desc limit ' + num + ' offset ' + num * (current_page - 1);

            connection.query(str, channel, function (err, result) {
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

router.get("/channel_ph", (req, res, next) => {
    var channel = req.query.channel;
    console.log("获取数据")
    pool.getConnection(function (err, connection) {
        if (err) {
            res.send("数据库连接失败！");
            console.log("数据库连接失败！");
        } else {
            var str = 'select * from content a1 where channel=? order by id desc limit 5 offset 0';
            connection.query(str, channel, function (err, result) {
                if (err) {
                    console.log(err);
                    ho(res, ho.status.e500, err);
                } else {
                    ho(res, ho.status.ok, result);
                    console.log("asdfdsf");
                }
                connection.release();
            });
        }
    });
});
//首页的轮播图
router.get("/homepage_ph", (req, res, next) => {
    var current_page = req.query.current_page;
    var num = req.query.pageSize;
    console.log("获取数据")
    pool.getConnection(function (err, connection) {
        if (err) {
            res.send("数据库连接失败！");
            console.log("数据库连接失败！");
        } else {
            var str = 'select a1.id,a1.title,a1.titleImage,a1.time,a1.comment,a1.clicks,a1.author from content a1 inner join(select a.channel,' +
                'a.id from content a left join content b on a.channel=b.channel and a.id<=b.id group by a.channel,' +
                'a.id having count(b.id)<=2)b1 on a1.channel=b1.channel and a1.id=b1.id order by a1.channel,' +
                'a1.id desc';
            connection.query(str, function (err, result) {
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

//首页的除了天下的新闻
router.get("/homepage_newslist", (req, res, next) => {
    var current_page = req.query.current_page;
    var num = req.query.num;
    var channel = "天下";
    console.log("获取数据")
    pool.getConnection(function (err, connection) {
        if (err) {
            res.send("数据库连接失败！");
            console.log("数据库连接失败！");
        } else {
            var str = 'select a1.id,a1.title,a1.titleImage,a1.time,a1.author,a1.subTitle,a1.clicks,a1.comment from content a1 inner join(select a.channel,' +
                'a.id from content a left join content b on a.channel=b.channel and a.id<=b.id group by a.channel,' +
                'a.id having count(b.id)<=5)b1 on a1.channel=b1.channel and a1.id=b1.id where a1.channel !=? order by a1.channel,' +
                'a1.id desc limit ' + num + ' offset ' + num * (current_page - 1);

            connection.query(str, channel, function (err, result) {
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
// 获取首页的天下新闻
router.get("/homepage_inner_news", (req, res, next) => {
    var current_page = req.query.current_page;
    var num = req.query.num;
    var channel = "天下";
    console.log("获取数据")
    pool.getConnection(function (err, connection) {
        if (err) {
            res.send("数据库连接失败！");
            console.log("数据库连接失败！");
        } else {
            str = 'select a1.id,a1.title,a1.titleImage,a1.time,a1.comment,a1.clicks,a1.author from content a1 where channel=? order by id desc limit ' + num + ' offset ' + num * (current_page - 1);
            connection.query(str, channel, function (err, result) {
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

//后台获取的内容
router.get("/admin_list", (req, res, next) => {
    // var current_page = req.query.pageNumber;
    // var num = req.query.pageSize;
    console.log("获取数据")
    pool.getConnection(function (err, connection) {
        if (err) {
            res.send("数据库连接失败！");
            console.log("数据库连接失败！");
        } else {
            connection.query('select count(*) count from content', function (err, count) {
                if (err) {
                    console.log(err);
                    ho(res, ho.status.e500, err);
                } else {
                    var count=count;
                    var current_page = req.query.pageNumber;
                     var num = req.query.pageSize;
                    connection.query('select * from content order by id desc limit ' + num + ' offset ' + num * (current_page - 1), function (err, result) {
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

//推送
router.get("/recommend", (req, res, next) => {
    var id = req.query.id;
    var str = req.query.sort;
    var s = str.split(",");
    var sort = s[0];
    pool.getConnection(function (err, connection) {
        if (err) {
            res.send("数据库连接失败！");
            console.log("数据库连接失败！");
        } else {
            connection.query("select * from content where sort like '%" + sort + "%' order by id desc limit 7 offset 0",
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
//查询
router.get("/search", (req, res, next) => {
    var current_page = req.query.current_page;
    var num = req.query.num;
    var keyword = req.query.keyword;
    pool.getConnection(function (err, connection) {
        if (err) {
            res.send("数据库连接失败！");
            console.log("数据库连接失败！");
        } else {

            str = "select * from content where title like '%" + keyword + "%' or contentText like '%" + keyword + "%' or subTitle like '%" + keyword + "%' order by id desc limit " + num + " offset " + num * (current_page - 1);

            connection.query(str, function (err, result) {
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
//得到一条数据
router.get("/getone", (req, res, next) => {
    var id = req.query.id;
    console.log("查询")

    pool.getConnection(function (err, connection) {
        if (err) {
            res.send("数据库连接失败！");
            console.log("数据库连接失败！");
        } else {
            connection.query("select * from content where id=?", id,
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
            var str;
            connection.query('insert into content set?', {
                    title: req.body.title,
                    subTitle: req.body.subTitle,
                    channel: req.body.channel,
                    sort: req.body.sort,
                    author: req.body.author,
                    time:time,
                    titleImage: req.body.titleImage,
                    contentText: req.body.contentText,
                    clicks: 0,
                    comment: 0
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

            connection.query('delete from content where id in(' + id + ')', function (err, result) {
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
//更新文章被点击量
router.post("/update_clicks", (req, res, next) => {
    var id = req.body.id;
    pool.getConnection(function (err, connection) {
        if (err) {
            res.send("数据库连接失败！");
            console.log("数据库连接失败！")
        } else {
            var str;
            var al = req.body;
            connection.query('update content set clicks=clicks+1 where id=?', id, function (err, result) {
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
//更新文章评论
router.post("/update_comment", (req, res, next) => {
    var id = req.body.id;
    pool.getConnection(function (err, connection) {
        if (err) {
            res.send("数据库连接失败！");
            console.log("数据库连接失败！")
        } else {
            var str;
            connection.query('update content set comment=comment+1 where id=?', id, function (err, result) {
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
/**************************App********************************************* */
//APP首页新闻
router.get("/app_hp_newslist", (req, res, next) => {
    var current_page = req.query.current_page;
    var num = req.query.num;
    pool.getConnection(function (err, connection) {
        if (err) {
            res.send("数据库连接失败！");
            console.log("数据库连接失败！");
        } else {
            var str = 'select a1.* from content a1 inner join(select a.channel,' +
                'a.id from content a left join content b on a.channel=b.channel and a.id<=b.id group by a.channel,' +
                'a.id having count(b.id)<=6)b1 on a1.channel=b1.channel and a1.id=b1.id order by a1.id desc';

            connection.query(str, function (err, result) {
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
module.exports = router;