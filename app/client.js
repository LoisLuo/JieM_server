const express = require('express');

let router = express.Router();

const ho=require('./base/httpOutput');
const Book=require('./component/addBook');
const fileUpload=require('./component/fileUpload');

const CheckToken=require('./base/checkLogin');
const Login=require("./base/Login");

const Content=require('./component/content');
const Video=require('./component/video');
const Channel=require('./component/channel');
const Sort=require('./component/sort');
const User=require('./component/user');
const Comment=require('./component/comment');
const Reply=require('./component/reply');
const Isemg=require('./component/isEmergencies');
const UserBrowse=require('./component/userBrowse');
const Praise=require('./component/praise');

router.post("/login",Login);
router.use("*", CheckToken);


router.use("/book",Book);
router.use("/upload",fileUpload);
router.use("/channel",Channel);
router.use("/sort",Sort);
router.use("/content",Content);
router.use("/isEmergencies",Isemg);
router.use("/video",Video);
router.use("/user",User);
router.use("/comment",Comment);
router.use("/reply",Reply);
router.use("/userbrowse",UserBrowse);
router.use("/praise",Praise);


router.get("/checkLogin", (req, res) => {
    ho(res, ho.status.ok);
});
module.exports=router;