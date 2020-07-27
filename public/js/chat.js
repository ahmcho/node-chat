const socket = io();
//Elements
const $messageForm = document.querySelector('#messageForm');
const $imageForm = document.querySelector("#imageForm");
const $messageFormInput = $messageForm.querySelector("input")
const $imageUpload = document.querySelector("imageUpload");
const $imageUploadButton = document.querySelector("#imageUploadButton");
const $messageFormButton = $messageForm.querySelector("button");
const $sendLocation = document.querySelector("#sendLocation");
const $messages = document.querySelector("#messages");

//Templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationTemplate = document.querySelector("#location-template").innerHTML;
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;
const imageTemplate = document.querySelector("#image-template").innerHTML;

//Options
const {username, room} = Qs.parse(location.search,{ignoreQueryPrefix: true});

const autscroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild
    
    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage);
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin
    
    //Visible height
    const visibleHeight = $messages.offsetHeight

    //Height of messages container
    const contentHeight = $messages.scrollHeight

    //How far have I scrolled
    const scrollOffset = $messages.scrollTop + visibleHeight

    if(contentHeight - newMessageHeight <= scrollOffset){
        //Autoscrolling
        $messages.scrollTop = $messages.scrollHeight
    }
}

socket.on('message', (message) => {
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('HH:mm:ss')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autscroll();
})

socket.on('locationMessage', (message) => {
    const html = Mustache.render(locationTemplate, {
        username: message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format('HH:mm:ss')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autscroll();
})

socket.on('image', ({url,username,createdAt}) => {
    const html = Mustache.render(imageTemplate, {
        url,
        username,
        createdAt: moment(createdAt).format('HH:mm:ss')
    })
    $messages.insertAdjacentHTML('beforeend',html);
    //autoscroll();
});

socket.on('roomData',({room, users}) => {
   const html = Mustache.render(sidebarTemplate, {
       room,
       users
   })
   document.querySelector("#sidebar").innerHTML = html;
})

imageUpload.addEventListener("change", async (e) => {
    const data = new FormData();
    data.append('files',e.target.files[0]);
    const options = {
        method: 'POST',
        body: data
    }
    const response = await fetch('https://cors-anywhere.herokuapp.com/https://telegra.ph/upload', options);
    const result = await response.json();
    const url = `https://telegra.ph${result[0].src}`;
    socket.emit('picture', url, () => {
        console.log('Picture shared');
    });
    console.log(url);
})



$imageForm.addEventListener("submit", (e) => {
    e.preventDefault();
    imageUpload.click();
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    $messageFormButton.setAttribute('disabled','disabled');
    const message = e.target.elements.message.value;
    socket.emit('sendMessage',message, (error) => {
        $messageFormButton.removeAttribute('disabled');
        $messageFormInput.value = '';
        $messageFormInput.focus();
        if(error){
            return console.log(error);
        }
        console.log('The message was delivered.')
    });
})

document.querySelector("#sendLocation").addEventListener("click", () => {
    $sendLocation.setAttribute("disabled", "disabled");
    if(!navigator.geolocation){
        return alert('Geolocation is not supported by your browser!')
    }

    navigator.geolocation.getCurrentPosition((position) => {
        $sendLocation.removeAttribute('disabled');
       socket.emit('sendLocation', { latitude: position.coords.latitude, longitude: position.coords.longitude }, () => {
           console.log('The location was shared');
       })
    })
})

socket.emit('join',{ username, room }, (error) => {
    if(error){
        alert(error);
        location.href = '/';
    }
})

