const users = []

// add , remove , get (user) , get Room

const addUser = ( {id , username , room} ) =>{
    //Clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // validate the data

    if(!username || !room){
        return{
            error: 'กรุณากรอกชื่อ แล้ว ห้องที่ต้องการเข้า !!!'
        }
    }

    // Check for exsting user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })
    
    // Validate username 
    if(existingUser){
        return{
            error: 'ชื่อนี้มีคนใช้แล้ว !!!'
        }
    }

    // store user
    const user = { id , username , room}
    users.push(user)
    return { user }
}

const removeUser = (id) =>{
    const index = users.findIndex((user) => user.id === id)

    if(index !== -1){
        return users.splice(index , 1)[0]
    }
}

const getUser = (id) =>{
    return users.find((user) => user.id === id)
}

const getUserInRoom = (room) =>{
    room = room.trim().toLowerCase()
    return users.filter((user) => user.room === room)
}

module.exports = {
    addUser, 
    removeUser,
    getUser,
    getUserInRoom
}