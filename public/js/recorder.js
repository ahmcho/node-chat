const recorderBtn = document.getElementById("#recorder");
const audioTemplate = document.getElementById("audio-template").innerHTML;
let stream, recorder, counter=1, chunks, media;
let log = console.log.bind(console);
const ul = document.querySelector("#files");
const mediaOptions = {
    audio: {
      tag: 'audio',
      type: 'audio/ogg',
      ext: '.ogg',
      gUM: {audio: true}
    }
};
media = mediaOptions.audio;
navigator.mediaDevices.getUserMedia(media.gUM)
.then(_stream => {
    stream = _stream;
    recorder = new MediaRecorder(stream);
    recorder.ondataavailable = e => {
        chunks.push(e.data);
        if(recorder.state == 'inactive')  {
            var blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
            socket.emit('radio', blob);
        }
    };
    mediaRecorder.onstart = function(e) {
                this.chunks = [];
    };
    
})
.catch(log);
function makeLink(){
    let blob = new Blob(chunks, {type: media.type });
    let url = URL.createObjectURL(blob);
    let li = document.createElement('li')
    let mediTag = document.createElement(media.tag);
    mediTag.controls = true;
    mediTag.src = url;
    li.appendChild(mediTag);
    ul.appendChild(li);
}

const recorderBtnDown = () => {
    chunks=[];
    recorder.start();
}
const recorderBtnUp = () => {
    recorder.stop()
}

socket.on('voice', (data) => {
    console.log(data)
    var blob = new Blob([data.blob], { 'type' : 'audio/ogg; codecs=opus' });
    audio = window.URL.createObjectURL(blob);
    const html = Mustache.render(audioTemplate, {
        audio,
        username,
        createdAt: moment(data.createdAt).format('HH:mm:ss')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autscroll();
 })
 