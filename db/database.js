const mongoose = require('mongoose');

const promise = new Promise((resolve,reject) => {
    mongoose.connect('mongodb://localhost:27017/gzhipin');

    mongoose.connection.on('connected',(err)=>{
        if(!err){
            console.log('数据库连接成功')
            resolve()
        }else {
            console.log('数据库连接失败' + err)
            reject()
        }
    })
});

module.exports = promise;
