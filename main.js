const {
  MeshDevice,
  Conference
} = meshConference
const peerId = Math.random().toString(36).substr(2, 8);
const $ = document.querySelector.bind(document);

let conference;

const VIDEO_CONSTRAINS =
{
	'verylow' :
	{
		width  : { exact: 80 },
		height : { exact: 60 }
	},
	'low' :
	{
		width  : { exact: 320 },
		height : { exact: 240 }
	},
	'medium' :
	{
		width  : { exact: 640 },
		height : { exact: 480 }
	},
	'high' :
	{
		width  : { exact: 1280 },
		height : { exact: 720 }
	},
	'veryhigh' :
	{
		width  : { exact: 1920 },
		height : { exact: 1080 }
	},
	'ultra' :
	{
		width  : { exact: 3840 },
		height : { exact: 2160 }
	}
};

main();

async function main(){
  const jwtToken = window.sessionStorage.getItem('jwtToken');
  console.log("Access token:", jwtToken);
  if(!jwtToken){
    window.location.href = '/login.html';
    return;
  }
  
  autoGenerateRoomIdAndDisplayName();
  const meshDevice = new MeshDevice();
  meshDevice.initDevice();
  startConference(meshDevice, jwtToken);
  leaveConferenceListener();

}


async function startConference(meshDevice, jwtToken){
  $('#btn-createAndJoinRoom').addEventListener('click', async function() {
    createOrJoinRoom(meshDevice, jwtToken, true)
  })

  $('#btn-joinRoom').addEventListener('click', async function() {
    createOrJoinRoom(meshDevice, jwtToken, false)
  })
}


async function createOrJoinRoom(meshDevice, jwtToken, create){
  if($('#input-roomId').value === '' || $('#input-displayName').value === ''){
    alert('All inputs should not be empty!');
  }else{
    $('#local-displayName').textContent = $('#input-displayName').value
    $('#btn-createAndJoinRoom').disabled = true;
    $('#btn-joinRoom').disabled = true;
    $('#btn-leaveConference').disabled = false;
    $('#btn-shareScreenSwitch').disabled = false;
    $('#btn-micSwitch').disabled = false;
    $('#btn-webcamSwitch').disabled = false;

    const serverUrl = await getConferenceServer(jwtToken);
    if(!serverUrl){
      console.log("No serverUrl belongs to you!!");
      return;
    }

    conference = new Conference(
      meshDevice,
      serverUrl,
      peerId,
      $('#input-roomId').value,
      jwtToken,
      $('#input-displayName').value,
      create
    );

    conference
      .on('unauthorized', reason => {
        console.log("Unauthoized:", reason);
        alert("Unauthoized:", reason);
      })
      .on('noDecision', err => {
        /* 當 conference object 帶入的 create 不是 boolean 時 */
        alert(err.message);
      })
      .on('create:duplicatedRoom', err => {
        /* 當選擇 create room，但 roomId 已經被使用過 */
        alert(err.message);
      })
      .on('join:roomNotExist', err => {
        /* 當選擇 join room，但 room 並不存在 */
        alert(err.message);
      })
      .on('roomReady', async () => {
        console.log("Room is ready. Start conference");
        const accessCapabilities = await conference.loadRouterRtpCapabilities();
        if(!accessCapabilities){
          console.log("Your device cannot support WebRTC.");
          return;
        }
  
        await conference.handleTransport(true);
        
        const joinInfo = await conference.join();
        console.log(joinInfo);

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            frameRate: { max: $('#select-framerateList').value }
          },
          audio: true 
        });
        const webcamTrack = stream.getVideoTracks()[0];
        const audioTrack = stream.getAudioTracks()[0];
        if(webcamTrack){
          const stream = new MediaStream();
          stream.addTrack(webcamTrack);
          $('#video-local').srcObject = stream;
          $('#select-resolutionList').classList.remove('hide');
          $('#select-framerateList').classList.remove('hide');
          changeResolutionListener()
          changeFramerateListener()
        }
        
        if(audioTrack){
          const stream = new MediaStream();
          stream.addTrack(audioTrack);
          $('#audio-local').srcObject = stream;
        }
  
        await conference.produce(audioTrack, {
          source: 'mic'
        });
        await conference.produce(webcamTrack, {
          source: 'webcam'
        });
        
        shareScreenListerner();
        micListener();
        webcamListener();
        changeDeviceListener();
      })
      .on('personalData', ({ peerId, displayName, roles }) => {
        console.log("Personal data: ", { peerId, displayName, roles })
      })
      .on('addtrack', ({track, displayName, peerId, source}) => {
        addRemoteMedia(track, displayName, peerId, source);
      })
      .on('removetrack', ({track, displayName, peerId, source}) => {
        removeRemoteMedia(track, peerId, source);
      })
      .on('newPeer', ({ peerId, displayName, picture, roles }) => {
        console.log("Joined peer:", { peerId, displayName, picture, roles });
      })
      .on('activeSpeaker', ({ peerId, volume, numOfPeers }) => {
        // console.log("active Speaker:", { peerId, volume });
      })
      .on('producerScore', ({ source, score }) => {
        console.log('Producer score:', { source, score })
      })
      .on('consumerScore', ({ peerId, source, score }) => {
        console.log('Consumer score:', { peerId, source, score })
      })
      .on('peerClosed', ({ closedPeerId }) => {
        console.log("Closed peer", closedPeerId);
        removeAllMediaElementsFromThePeer(closedPeerId);
      })
      .on('listAllDevices', ({ webcamDevices, audioInputDevices, audioOutputDevices }) => {
        console.log('All Devices:', { webcamDevices, audioInputDevices, audioOutputDevices})
        Object.keys(webcamDevices).forEach(key => {
          const option = document.createElement("option");
          option.value = key;
          option.text = webcamDevices[key].label;
          $('#select-webcamDevices').add(option);
        })

        Object.keys(audioInputDevices).forEach(key => {
          const option = document.createElement("option");
          option.value = key;
          option.text = audioInputDevices[key].label;
          $('#select-audioInputDevices').add(option);
        })

        Object.keys(audioOutputDevices).forEach(key => {
          const option = document.createElement("option");
          option.value = key;
          option.text = audioOutputDevices[key].label;
          $('#select-audioOutputDevices').add(option);
        })

      })
      .on('updateDevices', ({ webcamDevices, audioInputDevices, audioOutputDevices }) => {
        console.log('Updated devices:', { webcamDevices, audioInputDevices, audioOutputDevices})
        $('#select-webcamDevices').innerHTML = null;
        $('#select-audioOutputDevices').innerHTML = null;
        $('#select-audioInputDevices').innerHTML = null;
        Object.keys(webcamDevices).forEach(key => {
          const option = document.createElement("option");
          option.value = key;
          option.text = webcamDevices[key].label;
          $('#select-webcamDevices').add(option);
        })

        Object.keys(audioInputDevices).forEach(key => {
          const option = document.createElement("option");
          option.value = key;
          option.text = audioInputDevices[key].label;
          $('#select-audioInputDevices').add(option);
        })

        Object.keys(audioOutputDevices).forEach(key => {
          const option = document.createElement("option");
          option.value = key;
          option.text = audioOutputDevices[key].label;
          $('#select-audioOutputDevices').add(option);
        })
      })
      .on('numOfPeers:gt', ({ numOfPeers }) => {
        console.log(`num of peers are > ${numOfPeers}`)
      })
      .on('numOfPeers:lte', ({ numOfPeers }) => {
        console.log(`num of peers are ≤ ${numOfPeers}`)
      })
      .on('micTrackended', () => {
        
      });
  }
}

function leaveConferenceListener(){
  $('#btn-leaveConference').addEventListener('click', function() {
    conference.leaveRoom();
    window.location.reload();
  })
}

function changeResolutionListener(){
  $('#select-resolutionList').onchange = async function () {
    const resolution = $('#select-resolutionList').value;
    const videoTrack = $('#video-local').srcObject.getVideoTracks()[0];
    await videoTrack.applyConstraints(VIDEO_CONSTRAINS[resolution]);
    console.log(videoTrack);
    const stream = new MediaStream();
    stream.addTrack(videoTrack);
    $('#video-local').srcObject = stream;
  }

  $('#select-resolutionList').onchange();
}

function changeFramerateListener(){
  $('#select-framerateList').onchange = async function () {
    const framerate = $('#select-framerateList').value;
    const videoTrack = $('#video-local').srcObject.getVideoTracks()[0];
    await videoTrack.applyConstraints({frameRate: { max: framerate }});
    console.log(videoTrack);
    const stream = new MediaStream();
    stream.addTrack(videoTrack);
    $('#video-local').srcObject = stream;
  }

  $('#select-framerateList').onchange();
}

function shareScreenListerner(){
  $('#btn-shareScreenSwitch').addEventListener('click', async function() {
    if($('#btn-shareScreenSwitch').classList.contains('on')){
      $('#screen-share-local').srcObject = null;
      await conference.closeSharedScreen();
      $('#btn-shareScreenSwitch').classList.remove('on');
      return;
    }

    
    let captureStream = null;

    try {
      captureStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
    } catch(err) {
      console.error("Error: " + err);
    }

    if(captureStream){
      const captureStreamTrack = captureStream.getVideoTracks()[0];
      captureStreamTrack.onended = async () => {
        $('#screen-share-local').srcObject = null;
        await conference.closeSharedScreen();
        $('#btn-shareScreenSwitch').classList.remove('on');
        return;
      }
      const stream = new MediaStream();
      stream.addTrack(captureStreamTrack);
      $('#screen-share-local').srcObject = stream;

      await conference.produce(captureStreamTrack,{
        source : 'screen'
      });

      $('#btn-shareScreenSwitch').classList.add('on');
    }

  });
}

function micListener(){
  $('#btn-micSwitch').addEventListener('click', async function() {
    if($('#btn-micSwitch').classList.contains('off')){
      $('#btn-micSwitch').classList.remove('off');
      await conference.resumeMic();
      return;
    }
    
    $('#btn-micSwitch').classList.add('off');
    await conference.pauseMic();
  })
}

function webcamListener(){
  $('#btn-webcamSwitch').addEventListener('click', async function() {
    if($('#btn-webcamSwitch').classList.contains('off')){
      $('#btn-webcamSwitch').classList.remove('off');
      const videoStream = await navigator.mediaDevices.getUserMedia({
        video: {
          frameRate: { max: $('#select-framerateList').value }
        }
      });
      const webcamTrack = videoStream.getVideoTracks()[0];
      const stream = new MediaStream();
      stream.addTrack(webcamTrack);
      $('#video-local').srcObject = stream;
      await conference.produce(webcamTrack, {
        source: 'webcam'
      });
      return;
    }

    $('#btn-webcamSwitch').classList.add('off');
    await conference.closeWebcam();
  })
}

function registerRemoteSwitchListener(id, peerId, source){
  const element = document.getElementById(id);
  element.addEventListener('click', async function(){
    if(element.classList.contains('off')){
      await conference.resumeConsumer(peerId, source);
      element.classList.remove('off');      
      return;
    }
    await conference.pauseConsumer(peerId, source);
    element.classList.add('off');
  });
}

function changeDeviceListener(){
  $('#select-webcamDevices').onchange = async function () {
    // 改變相機裝置
    console.log("Webcam changes");
    console.log($('#select-webcamDevices').value);

    // 關掉舊的 webcam video stream
    await conference.closeWebcam();

    const newVideoStream = await navigator.mediaDevices.getUserMedia({ 
      video: {
        deviceId : { ideal: $('#select-webcamDevices').value },
        frameRate: { max: $('#select-framerateList').value }
      }
    });
    const webcamTrack = newVideoStream.getVideoTracks()[0];
    const stream = new MediaStream();
    stream.addTrack(webcamTrack);
    $('#video-local').srcObject = stream;
    await conference.produce(webcamTrack, {
      source: 'webcam'
    });
  }

  $('#select-audioOutputDevices').onchange = async function () {
    // 改變耳機裝置
    console.log("audio output changes");
    console.log($('#select-audioOutputDevices').value);

    // 設定所有 remote audio 的音訊都指向所選的耳機裝置
    const remoteAudioElements = document.getElementsByClassName('remote-audio');
    console.log(remoteAudioElements);
    Array.from(remoteAudioElements).forEach(el => {
      el.setSinkId($('#select-audioOutputDevices').value)
    });
  }

  $('#select-audioInputDevices').onchange = async function () {
    // 改變麥克風裝置
    console.log("audio input changes");
    console.log($('#select-audioInputDevices').value);
    await conference.closeMic();

    const newAudioStream = await navigator.mediaDevices.getUserMedia({ 
      audio: {
        deviceId : { ideal: $('#select-audioInputDevices').value }
      }
    });
    const micTrack = newAudioStream.getAudioTracks()[0];
    const stream = new MediaStream();
    stream.addTrack(micTrack);
    $('#audio-local').srcObject = stream;
    await conference.produce(micTrack, {
      source: 'mic'
    });
  }
}

function autoGenerateRoomIdAndDisplayName(){
  $('#input-roomId').value = 'kenroom';
  $('#input-displayName').value = 'Guest';
}

async function getConferenceServer(jwtToken){
  const apiServer = `[API_URL]/conference-server`;

  const myHeaders = new Headers();
  myHeaders.append("Authorization", jwtToken);

  const options = {
    method: "GET",
    headers: myHeaders
  }

  const res = await fetch(apiServer, options);
  if(res.status != 200){
    console.log(res.data);

    alert('Token may be expired or invalid. Login again');
    window.location.href = '/login.html';
  }

  const { serverUrl } = JSON.parse(await res.text())
  
  return serverUrl;
}

function addRemoteMedia(track, displayName, peerId, source){
  console.log("Add remote media:", displayName, source);
  let videoContainer = document.getElementById(`container-${peerId}${source == 'screen' ? '-' + source : ''}`);
  if(!videoContainer){
    videoContainer = document.createElement('div');
    videoContainer.classList.add('container');
    videoContainer.setAttribute("id", `container-${peerId}${source == 'screen' ? '-' + source : ''}`);
    $('#videos').appendChild(videoContainer);
  }

  if(track.kind === 'video'){
    let videoRemote = document.getElementById(`video-${peerId}-${source}`);
    if(!videoRemote){
      const remoteVideoTag = document.createElement('video');
      remoteVideoTag.setAttribute("id", `video-${peerId}-${source}`);
      remoteVideoTag.setAttribute("width", "40%");
      remoteVideoTag.setAttribute("autoplay", "");
      remoteVideoTag.setAttribute("muted", "");
      remoteVideoTag.setAttribute("playsinline", "");
      remoteVideoTag.setAttribute("controls", "");
      videoContainer.appendChild(remoteVideoTag);
      const videoSwitchButton = document.createElement('button');
      videoSwitchButton.classList.add('remote-video-buttons');
      videoSwitchButton.setAttribute("id", `videoSwitch-${peerId}-${source}`);
      videoSwitchButton.innerHTML = 'Video';
      videoContainer.appendChild(videoSwitchButton);
      registerRemoteSwitchListener(`videoSwitch-${peerId}-${source}`, peerId, source);
      videoRemote = document.getElementById(`video-${peerId}-${source}`);
    }
    let stream = new MediaStream();
    stream.addTrack(track);
    videoRemote.srcObject = stream;
  }

  if(track.kind === 'audio'){
    let audioRemote = document.getElementById(`audio-${peerId}-${source}`);
    if(!audioRemote){
      const remoteAudioTag = document.createElement('audio');
      remoteAudioTag.classList.add('remote-audio');
      remoteAudioTag.setAttribute("id", `audio-${peerId}-${source}`);
      remoteAudioTag.setAttribute("autoplay", "");
      remoteAudioTag.setAttribute("playsinline", "");
      videoContainer.appendChild(remoteAudioTag);
      const audioSwitchButton = document.createElement('button');
      audioSwitchButton.classList.add('remote-audio-buttons');
      audioSwitchButton.setAttribute("id", `audioSwitch-${peerId}-${source}`);
      audioSwitchButton.innerHTML = 'Audio';
      videoContainer.appendChild(audioSwitchButton);
      registerRemoteSwitchListener(`audioSwitch-${peerId}-${source}`, peerId, source);
      audioRemote = document.getElementById(`audio-${peerId}-${source}`);
    }
    let stream = new MediaStream();
    stream.addTrack(track);
    audioRemote.srcObject = stream;

  }
  
  const overlayDiv = document.createElement('div');
  overlayDiv.classList.add('overlayText');
  const displayNameText = document.createElement('p');
  displayNameText.innerHTML = displayName;
  overlayDiv.appendChild(displayNameText);
  videoContainer.appendChild(overlayDiv);

}

function removeRemoteMedia(track, peerId, source){
  if(track.kind === 'video'){
    const remoteVideo = document.getElementById(`video-${peerId}-${source}`);
    if(remoteVideo) remoteVideo.srcObject = null;
    if(source === 'screen'){
      const screenElement = document.getElementById(`container-${peerId}-screen`);
      screenElement.remove();
    }
  }

  if(track.kind === 'audio'){
    const remoteAudio = document.getElementById(`audio-${peerId}-${source}`);
    if(remoteAudio) remoteAudio.srcObject = null;
  }
}

function removeAllMediaElementsFromThePeer(peerId){
  const videoElement = document.getElementById(`container-${peerId}`);
  const screenElement = document.getElementById(`container-${peerId}-screen`);
  if(videoElement) videoElement.remove();
  if(screenElement) screenElement.remove();
}