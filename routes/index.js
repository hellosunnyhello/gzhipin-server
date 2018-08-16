var express = require('express');
var router = express.Router();
const md5 = require('blueimp-md5');

const Users = require('../Models/Users')
const Charts = require('../Models/Chats')

const filter = {password:0, __v:0}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
/*
提供一个用户注册的接口
a)path为: /register
b)请求方式为: POST
c)接收username和password参数
d)admin是已注册用户
e)注册成功返回: {code: 0, data: {_id: 'abc', username: ‘xxx’, password:’123’}
f)注册失败返回: {code: 1, msg: '此用户已存在'}
*/


//注册路由
router.post('/register',(req,res) => {
    const {username, password, type} = req.body;
    Users.findOne({username},(err,data) => {
        if(!err){
           if(data){
               res.send({code: 1, msg: '此用户已存在'})
           }else {
               Users.create({username, password:md5(password), type},(err,data) => {
                   if(!err){
                       res.cookie('user_id',data._id,{maxAge: 1000*3600*24*7})
                       res.send({code: 0, data: {username, type, _id: data._id} })
                   }else {
                       console.log(err)
                   }
               })


           }
        }else {
            console.log(err)
        }
    })

});
//登录路由
router.post('/login', (req,res) => {
    const {username,password} = req.body
    Users.findOne({username,password:md5(password)}, filter, (err,data) => {
        if(!err){
            if(data){
                res.cookie('user_id',data._id,{maxAge: 1000*3600*24*7})
                res.send({code: 0, data})
            }else {
                res.send({code: 1, msg: '此用户不存在'})
            }
        }else {
            console.log(err)
        }
    })
})
//完善用户信息的路由
router.post('/update', (req,res) => {

    const {user_id} = req.cookies

    if(!user_id){
        res.send({code: 1, msg: "请先登陆"})
    }
    Users.findByIdAndUpdate({_id: user_id},req.body,function (err,user) {
        if(!err){
            if(user){
                const {_id, username,type} = user
                const data = Object.assign({_id, username,type}, req.body)
                res.send({code: 0, data})
            }else {
                res.clearCookie('user_id')
                res.send({code: 1, msg: "请先登陆"})
            }
        }else {
            console.log(err)
        }
    })
})

//获取用户详细信息的路由
router.get('/user',(req,res) =>{
    const {user_id} = req.cookies
    if(!user_id){
        res.send({code: 1, msg: "请先登陆"})
    }
    Users.findOne({_id: user_id},filter,(err,data) => {
        if(!err){
            if(data){
                res.send({code: 0, data})
            }else {
                res.clearCookie('user_id')
                res.send({code: 1, msg: "请先登陆"})
            }
        }else {
            console.log(err)
        }
    })
})
//获取用户列表的路由
router.get('/userlist',(req,res)=>{
    const {type} = req.query

    Users.find({type},filter,(err,users)=>{
        if(!err){
            res.send({code: 0, data: users})
        }else {
            console.log(err)
        }
    })

})

//获取当前用户的聊天消息列表

module.exports = router;
