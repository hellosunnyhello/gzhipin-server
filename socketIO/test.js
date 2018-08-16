//commonJS的方式向外暴露一个函数，传参server
module.exports = function (server) {
    // 得到IO对象(管理对象)，需要IO对象去监视所有的socket连接
    const io = require('socket.io')(server)
    // 创建IO监听连接，回调函数传入socket对象， //socket代表客户端与服务器的连接
    io.on('connection',function (socket) {
        //打印日志socket连接成功
        console.log('socket连接成功了')
        // 给本次会话的socket绑定一个接收消息的事件，回调函数传入接收的data数据
        socket.on('sendMsg',function (data) {
            //调用IO对象的emit分发消息的方法(名称，数据)，服务器可以向所有的连接上的客户端发送消息
            io.emit('responseMsg',data)
            //打印日志服务器向浏览器回应消息了，和回应数据
            console.log('服务器到浏览器通讯成功',data)
        })


    })



}
