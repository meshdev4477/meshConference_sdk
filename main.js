const {
  MeshDevice,
  Conference
} = meshConference
const peerId = Math.random().toString(36).substr(2, 8);
const videoLocal = document.querySelector('#video-local')
const audioLocal = document.querySelector('#audio-local')
const videoArea = document.querySelector('#videos');
const inputRoomId = document.querySelector('#roomId');
const inputDisplayName = document.querySelector('#displayName');
const btnStartConference = document.querySelector('#startConference');
const btnLeaveConference = document.querySelector('#leaveConference');
const btnShareScreenSwitch = document.querySelector('#shareScreenSwitch');
const btnWebcamSwitch = document.querySelector('#webcamSwitch');
const btnMicSwitch = document.querySelector('#micSwitch');
const screenShareLocal = document.querySelector('#screen-share-local');
const localDisplayName = document.querySelector('#local-displayName');
const selectResolutionList = document.querySelector('#resolutionList');
const selectFramerateList = document.querySelector('#framerateList');

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
  btnStartConference.addEventListener('click', async function() {
    if(inputRoomId.value === '' || inputDisplayName.value === ''){
      alert('All inputs should not be empty!');
    }else{
      localDisplayName.textContent = inputDisplayName.value
      btnStartConference.disabled = true;
      btnLeaveConference.disabled = false;
      btnShareScreenSwitch.disabled = false;
      btnMicSwitch.disabled = false;
      btnWebcamSwitch.disabled = false;

      const serverUrl = await getConferenceServer(jwtToken);
      if(!serverUrl){
        console.log("No serverUrl belongs to you!!");
        return;
      }
      conference = new Conference(
        meshDevice,
        serverUrl,
        peerId,
        inputRoomId.value,
        jwtToken,
        inputDisplayName.value
      );

      conference
        .on('unauthorized', reason => {
          console.log("Unauthoized:", reason);
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
        .on('peerClosed', ({ closedPeerId }) => {
          console.log("Closed peer", closedPeerId);
          removeAllMediaElementsFromThePeer(closedPeerId);
        })


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
          frameRate: { max: selectFramerateList.value }
        },
        audio: true 
      });
      const webcamTrack = stream.getVideoTracks()[0];
      const audioTrack = stream.getAudioTracks()[0];
      if(webcamTrack){
        const stream = new MediaStream();
        stream.addTrack(webcamTrack);
        videoLocal.srcObject = stream;
        selectResolutionList.classList.remove('hide');
        selectFramerateList.classList.remove('hide');
        changeResolutionListener()
        changeFramerateListener()
      }
      
      if(audioTrack){
        const stream = new MediaStream();
        stream.addTrack(audioTrack);
        audioLocal.srcObject = stream;
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
    }
  })
}

function leaveConferenceListener(){
  btnLeaveConference.addEventListener('click', function() {
    conference.leaveRoom();
    window.location.reload();
  })
}

function changeResolutionListener(){
  selectResolutionList.onchange = async function () {
    const resolution = selectResolutionList.value;
    const videoTrack = videoLocal.srcObject.getVideoTracks()[0];
    await videoTrack.applyConstraints(VIDEO_CONSTRAINS[resolution]);
    console.log(videoTrack);
    const stream = new MediaStream();
    stream.addTrack(videoTrack);
    videoLocal.srcObject = stream;
  }

  selectResolutionList.onchange();
}

function changeFramerateListener(){
  selectFramerateList.onchange = async function () {
    const framerate = selectFramerateList.value;
    const videoTrack = videoLocal.srcObject.getVideoTracks()[0];
    await videoTrack.applyConstraints({frameRate: { max: framerate }});
    console.log(videoTrack);
    const stream = new MediaStream();
    stream.addTrack(videoTrack);
    videoLocal.srcObject = stream;
  }

  selectFramerateList.onchange();
}

function shareScreenListerner(){
  btnShareScreenSwitch.addEventListener('click', async function() {
    if(btnShareScreenSwitch.classList.contains('on')){
      screenShareLocal.srcObject = null;
      await conference.closeSharedScreen();
      btnShareScreenSwitch.innerHTML = 'start screen share';
      btnShareScreenSwitch.classList.remove('on');
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
        screenShareLocal.srcObject = null;
        await conference.closeSharedScreen();
        btnShareScreenSwitch.classList.remove('on');
        btnShareScreenSwitch.innerText = 'start screen share';

        return;
      }
      const stream = new MediaStream();
      stream.addTrack(captureStreamTrack);
      screenShareLocal.srcObject = stream;

      await conference.produce(captureStreamTrack,{
        source : 'screen'
      });

      btnShareScreenSwitch.classList.add('on');
      btnShareScreenSwitch.innerText = 'stop screen share';
    }

  });
}

function micListener(){
  btnMicSwitch.addEventListener('click', async function() {
    if(btnMicSwitch.classList.contains('off')){
      btnMicSwitch.classList.remove('off');
      btnMicSwitch.innerHTML = "mute audio";
      await conference.resumeMic();
      return;
    }
    
    btnMicSwitch.classList.add('off');
    btnMicSwitch.innerHTML = "resume audio";

    await conference.pauseMic();
  })
}

function webcamListener(){
  btnWebcamSwitch.addEventListener('click', async function() {
    if(btnWebcamSwitch.classList.contains('off')){
      btnWebcamSwitch.classList.remove('off');
      btnWebcamSwitch.innerHTML = "hide video";
      const videoStream = await navigator.mediaDevices.getUserMedia({
        video: {
          frameRate: { max: selectFramerateList.value }
        }
      });
      const webcamTrack = videoStream.getVideoTracks()[0];
      const stream = new MediaStream();
      stream.addTrack(webcamTrack);
      videoLocal.srcObject = stream;
      await conference.produce(webcamTrack, {
        source: 'webcam'
      });
      return;
    }

    btnWebcamSwitch.classList.add('off');
    btnWebcamSwitch.innerHTML = "play video";

    await conference.closeWebcam();
  })
}

function registerRemoteSwitchListener(id, peerId, source){
  const buttonTexts = {
    'webcam':{
      "on": "hide video",
      "off": "play video"
    },
    'mic': {
      "on": "mute audio",
      "off": "resume audio"
    },
    'screen': {
      "on": "hide screen share",
      "off": "play screen share"
    }
  }
  const element = document.getElementById(id);
  element.addEventListener('click', async function(){
    if(element.classList.contains('off')){
      await conference.resumeConsumer(peerId, source);
      element.classList.remove('off');
      element.innerHTML = buttonTexts[source].on;
      return;
    }
    await conference.pauseConsumer(peerId, source);
    element.classList.add('off');
    element.innerHTML = buttonTexts[source].off;
  });
}

function autoGenerateRoomIdAndDisplayName(){
  // inputRoomId.value = randomString({ length: 8 }).toLowerCase();
  inputRoomId.value = 'kenroom';
  inputDisplayName.value = 'Guest';
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
    videoArea.appendChild(videoContainer);
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
      videoSwitchButton.innerHTML =  source === 'screen' ? 'hide screen share' : 'hide video'
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
      audioSwitchButton.innerHTML = 'hide audio'
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