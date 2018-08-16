const Chats = require('../Models/Chats')
module.exports = function (server) {
    // 得到IO对象
    const io = require('socket.io')(server)
    // 监视连接(当有一个客户连接上时回调)
    io.on('connection', function (socket) {
        console.log('soketio connected')
        // 绑定sendMsg监听, 接收客户端发送的消息
        socket.on('sendMsg', function ({content,from,to}) {
            console.log('服务器接收到浏览器的消息', {content,from,to})
            // 向客户端发送消息(名称, 数据)
            const chat_id = [from,to].sort().join('')
            const create_time = Date.now()
            new Chats({content,from,to,chat_id,create_time}).save((err,doc)=>{
                if(!err){
                    io.emit('receiveMsg',doc)
                }else {
                    console.log(err)
                }
            })
        })
    })
}