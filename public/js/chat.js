const socket = io();
//Elements
const $messageForm = document.querySelector('#messageForm');
const $messageFormInput = $messageForm.querySelector("input")
const $messageFormButton = $messageForm.querySelector("button");
const $sendLocation = document.querySelector("#sendLocation");
const $messages = document.querySelector("#messages");

//Templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationTemplate = document.querySelector("#location-template").innerHTML;
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

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

socket.on('roomData',({room, users}) => {
   const html = Mustache.render(sidebarTemplate, {
       room,
       users
   })
   document.querySelector("#sidebar").innerHTML = html
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

        console.log('the message was delivered.')
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
           console.log('Location shared');
       })
    })
})

socket.emit('join',{ username, room }, (error) => {
    if(error){
        alert(error);
        location.href = '/';
    }
})

// let stream, recorder, counter=1, chunks, media;
// let log = console.log.bind(console);
// const ul = document.querySelector("#files");
// const mediaOptions = {
//     audio: {
//       tag: 'audio',
//       type: 'audio/ogg',
//       ext: '.ogg',
//       gUM: {audio: true}
//     }
// };
// media = mediaOptions.audio;
// navigator.mediaDevices.getUserMedia(media.gUM)
// .then(_stream => {
//     stream = _stream;
//     recorder = new MediaRecorder(stream);
//     recorder.ondataavailable = e => {
//         chunks.push(e.data);
//         if(recorder.state == 'inactive')  makeLink();
//     };
// })
// .catch(log);

// function makeLink(){
//     let blob = new Blob(chunks, {type: media.type });
//     let url = URL.createObjectURL(blob);
//     let li = document.createElement('li')
//     let mediTag = document.createElement(media.tag);
//     mediTag.controls = true;
//     mediTag.src = url;
//     li.appendChild(mediTag);
//     ul.appendChild(li);
// }