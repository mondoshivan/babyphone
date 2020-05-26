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

async function getMedia(constraints) {
    let stream = null;

    try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
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
    } catch(err) {
        console.error(err);
    }
}

getMedia(session).catch(e => {
    console.log(e);
});

