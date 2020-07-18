const audioTemplate = document.getElementById("audio-template").innerHTML;
( () => {
    let chunks = [];
    let recorder;
    const buttonRecord = document.querySelector('#recorderStart');
    const buttonStop = document.querySelector('#recorderStop');
    
    const saveRecordingChunk = event => {
        chunks.push(event.data);
    };

    const saveRecording = event => {
        const blob = new Blob(chunks, {  type: 'audio/ogg' });
        socket.emit('radio', blob);
    };

    if (('MediaRecorder' in window)) {    
        const record = event => {
          navigator.mediaDevices.getUserMedia({ audio: true })
          .then(stream => {
            recorder = new MediaRecorder(stream);
            recorder.start();
            recorder.ondataavailable = saveRecordingChunk;
            recorder.onstop = saveRecording;
            
            buttonRecord.classList.add('hidden');
            buttonStop.classList.remove('hidden');
          })
          .catch(error => {
            console.log(error)
          });
        };
        
        const stop = () => {
          recorder.stop();
          chunks = [];
          const tracks = recorder.stream.getTracks();
          tracks.forEach(function(track) {
              track.stop();
          });
          buttonRecord.classList.remove('hidden');
          buttonStop.classList.add('hidden');
        };

        buttonRecord.addEventListener('mouseup', record);
        buttonStop.addEventListener('mouseup', stop);
      } else {
        // Our browser does not support the MediaRecorder API, we'll show an error message
        customAlert();
      }
})();



socket.on('voice', (data) => {
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

 const customAlert = () => {
    let timerInterval;
    Swal.fire({
        title: 'Error!',
        html: 'Your browser does not support MediaRecorder API. Closing modal in <b></b> milliseconds.',
        timer: 1000,
        timerProgressBar: true,
        onBeforeOpen: () => {
            Swal.showLoading()
            timerInterval = setInterval(() => {
                const content = Swal.getContent()
                if (content) {
                    const b = content.querySelector('b')
                    if (b) {
                        b.textContent = Swal.getTimerLeft()
                    }
                }
            }, 100)
        },
        onClose: () => {
            clearInterval(timerInterval)
        }
    })
    .then((result) => {
        /* Read more about handling dismissals below */
        if (result.dismiss === Swal.DismissReason.timer) {
            console.log('I was closed by the timer')
        }
    })
}