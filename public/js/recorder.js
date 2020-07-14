const recorderBtn = document.getElementById("recorder");

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
recorderBtn.addEventListener("click", function() {
    if(recorder.state === 'inactive'){
        chunks = [];
        recorder.start();
        console.log(recorder.state);
        this.innerHTML = '<i class="fas fa-microphone"></i> Stop'
    } else if(recorder.state === 'recording'){
        recorder.stop();
        this.innerHTML = '<i class="fas fa-microphone"></i> Start'
    }

})


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
})
.catch(log);

const recorderBtnDown = () => {
   
}
const recorderBtnUp = () => {
    
}

socket.on('voice', (data) => {
    console.log(data)
    const blob = new Blob([data.blob], { 'type' : 'audio/ogg; codecs=opus' });
    audio = window.URL.createObjectURL(blob);
    const html = Mustache.render(audioTemplate, {
        audio,
        username: data.username,
        createdAt: moment(data.createdAt).format('HH:mm:ss')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autscroll();
 })
 