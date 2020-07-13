const { getUsers } = require('./users')


const rooms = []


// add a new room
const addRoom = (newRoom) => {
    // clean data
    newRoom = newRoom.trim().toLowerCase()

    // check if room existing
    const isRoomExisting = rooms.find( room => room === newRoom)

    // validate room
    if(isRoomExisting){
        return newRoom
    }

    // store room
    rooms.push(newRoom)
    return newRoom
}

// remove the rooms
const removeRoom = (roomName) => {

    const isUserInRoom = getUsers().find( user => user.room === roomName)

    // check if is still any user in this room
    if(isUserInRoom){
        return;
    }

    const index = rooms.findIndex( room => room === roomName)

    if(index !== -1){
        return rooms.splice(index, 1)[0]
    }
}

const getAllRooms = () => rooms

module.exports = {
    addRoom,
    removeRoom,
    getAllRooms
}
