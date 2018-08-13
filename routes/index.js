var express = require('express');
var router = express.Router();
const md5 = require('blueimp-md5');

const Users = require('../Models/Users')

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
/*router.post('/register',(req,res)=>{
  const {username,password} = req.body;
  console.log(req.body)
  if(username==='admin'||username==='hello'){
      res.send({code: 1, msg: '此用户已存在'})
  }else {
      res.send({code: 0, data: {_id: 'abc',username,password}})
  }
})*/

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
                       res.send({code: 0, data: {_id: data._id, username, type}})
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

router.post('/login', (req,res) => {
    const {username,password} = req.body
    Users.findOne({username,password:md5(password)},(err,data) => {
        if(!err){
            if(data){
                res.cookie('user_id',data._id,{maxAge: 1000*3600*24*7})
                res.send({code: 0, data: {_id: data._id, username, type:data.type}})
            }else {
                res.send({code: 1, msg: '此用户不存在，请注册'})
            }
        }else {
            console.log(err)
        }
    })
})

module.exports = router;
