'use strict';

let socket = new WebSocket("ws://localhost:8080/");
socket.binaryType = 'blob';


socket.onopen = () => {
    console.log("[open] Connection established");
};

socket.onmessage = event =>  {
    console.log(`[message] Data received from server: ${event.data}`);
};

socket.onclose = function(event) {
    if (event.wasClean) {
        console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
    } else {
        // e.g. server process killed or network down
        // event.code is usually 1006 in this case
        console.error('[close] Connection died');
    }
};

socket.onerror = function(error) {
    console.error(`[error] ${error.message}`);
};

const recordRTC = null;
const session = {
    audio: true,
    video: false,
};

function initializeRecorder(stream) {
    const audioContext = window.AudioContext;
    const context = new audioContext();
    const audioInput = context.createMediaStreamSource(stream);
    const bufferSize = 2048;
    // create a javascript node
    const recorder = context.createJavaScriptNode(bufferSize, 1, 1);
    // specify the processing function
    recorder.onaudioprocess = recorderProcess;
    // connect stream to our recorder
    audioInput.connect(recorder);
    // connect our recorder to the previous destination
    recorder.connect(context.destination);
}

function convertFloat32ToInt16(buffer) {
    let l = buffer.length;
    const buf = new Int16Array(l);
    while (l--) {
        buf[l] = Math.min(1, buffer[l]) * 0x7fff;
    }
    return buf.buffer;
}

function onError(data) {
    console.log(data);
}

function recorderProcess(e) {
    const left = e.inputBuffer.getChannelData(0);
    socket.send(convertFloat32ToInt16(left));
}

function transmit(stream) {
    const audioContext = window.AudioContext;
    const context = new audioContext();
    const audioInput = context.createMediaStreamSource(stream);
    const bufferSize = 2048;
    // create a javascript node
    const recorder = context.createScriptProcessor(bufferSize, 1, 1);
    // specify the processing function
    recorder.onaudioprocess = recorderProcess;
    // connect stream to our recorder
    audioInput.connect(recorder);
    // connect our recorder to the previous destination
    recorder.connect(context.destination);
}

function volumeProcess(stream) {
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const microphone = audioContext.createMediaStreamSource(stream);
    const javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

    analyser.smoothingTimeConstant = 0.8;
    analyser.fftSize = 1024;

    microphone.connect(analyser);
    analyser.connect(javascriptNode);
    javascriptNode.connect(audioContext.destination);
    javascriptNode.onaudioprocess = function() {
        const array = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);
        let values = 0;
        const length = array.length;
        for (let i = 0; i < length; i++) {
            values += (array[i]);
        }
        let average = values / length;
        colorLEDs(average);
    }
}

async function getMedia(constraints) {
    let stream = null;

    try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        // transmit(stream);
        volumeProcess(stream);

    } catch(err) {
        console.error(err);
    }
}

function colorLEDs(vol) {
    let allLEDs = document.getElementsByClassName('pid');
    allLEDs = Array.from(allLEDs);
    let ledAmount = Math.round(vol/10);
    let loudnessRange = allLEDs.slice(0, ledAmount);
    for (let i = 0; i < allLEDs.length; i++) {
        allLEDs[i].classList.remove('low');
        allLEDs[i].classList.remove('mid');
        allLEDs[i].classList.remove('high');
    }
    for (let i = 0; i < loudnessRange.length; i++) {
        if (i < 5 ) {
            loudnessRange[i].classList.add('low');
        } else if (i >= 5 && i < 8 ) {
            loudnessRange[i].classList.add('mid');
        } else {
            loudnessRange[i].classList.add('high');
        }
    }
}

getMedia(session).catch(e => {
    console.log(e);
});



