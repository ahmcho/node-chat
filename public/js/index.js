const socket = io()
const roomsTemplate = document.querySelector('#roomsTemplate').innerHTML



socket.emit('roomsListQuery')

socket.on('roomsList', (rooms) => {    
    const html = Mustache.render(roomsTemplate, { rooms })
    document.querySelector('#rooms').insertAdjacentHTML('beforeend', html)
})

