const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage , generateUrl } = require('./utils/messages')
const { addUser , getUser , getUserInRoom , removeUser } = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 46048
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

let count = 0

io.on('connection', (socket) => {
    console.log('Welcome!')

    socket.on('join' , ( options , callback)  => {
        const { error , user } = addUser({id: socket.id , ...options})

        if(error){
            return  callback(error)
        }

        socket.join(user.room)

        socket.emit('message' , generateMessage('Welcome!'))
        socket.broadcast.to(user.room).emit('message' , generateMessage(`${user.username} เข้าร่วมห้องแชทนี้ !!!`))
        io.to(user.room).emit('roomData',{
            room:user.room,
            users:getUserInRoom(user.room)
        })

        callback()
    })

    ///// send Message To chat ////

    socket.on('sendMessage' , (message , callback) =>{
        const user = getUser(socket.id)
        const filter = new Filter()

        if(filter.isProfane(message)){
            return callback('Profanity is not allowed!!!')
        }

        io.to(user.room).emit('message' , generateMessage(user.username,message))
        callback('')
    })

    ///// send Message To Location ////

    socket.on('sendLocation' , (coords,callback) =>{
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage' , generateUrl(user.username,`https:///google.com/maps?q=${coords.latitude},${coords.longtitude}`))
        callback()
    })

    socket.on('disconnect',() =>{
        const user = removeUser(socket.id)
        if(user){
            io.to(user.room).emit('message' , generateMessage(`${user.username} ออกจากห้องแชทนี้ !!!`))
            io.to(user.room).emit('roomData', {
                room:user.room,
                users:getUserInRoom(user.room)
            })
        }
    })

   
})

server.listen(port , () => {
    console.log(`Server Chat run on PORT : ${port}!!!`)
})