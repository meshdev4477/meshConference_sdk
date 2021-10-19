# meshConference sdk

## Initial setups

- Import sdk and its dependencies in `main.js`
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.3.1/socket.io.js" integrity="sha512-AcZyhRP/tbAEsXCCGlziPun5iFvcSUpEz2jKkx0blkYKbxU81F+iq8FURwPn1sYFeksJ+sDDrI5XujsqSobWdQ==" crossorigin="anonymous"></script>
<script src="./dist/index.sdk.js"></script>
```

- Access username/password and `[API_URL]` from meshub

- Put `[API_URL]` in the functions below

`login.js`

```javascript
function main(){
  btnLogin.addEventListener('click', () => {
    //...
    fetch(`[API_URL]/login`, requestOptions)
      .then(async response => {
        //...
      })
      .catch(error => {
        //...
      });
  })
}
```

`main.js`
```javascript
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
    return false;
  }

  const { serverUrl } = JSON.parse(await res.text())
  
  return serverUrl;
}
```

## how to execute demo code

- run local server ( ex: `php -S localhost:9527` )

- go to http://localhost:9527/login.html and use the username/password provided by meshub to login. If login successfully, you will be redirected to the main conference page.

> To establish a websocket connection with Mesh Conference Server, an auth token is required via Login API.
In Mesh Conference SDK demo, auth token is retrieved by making API request from browser directly for simplicity.
In a production deployment, to secure the login username/password, the auth token should be retrieved by making API request from a backend server, and passed from backend to browser.

## how to check if the server works normally
- GET https://[API_URL]/healthcheck

## sdk usage

- Import sdk

```javascript
const { MeshDevice, Conference } = meshConference
```

- Init device

```javascript
const meshDevice = new MeshDevice();
meshDevice.initDevice();
```

- Init conference object

```javascript
const conference = new Conference(
  meshDevice,   // MeshDevice object
  serverUrl,    // Mesh-conference backend url
  peerId,       // Auto-generated (8 characters)
  roomId,       // Enter the room name (user input)
  jwtToken,     // In order to access mesh-conference backend
  displayName   // Enter your name (user input)
  create        // Decide if you want to create or join room
);
```

- Check if your device supports WebRTC

```javascript
const accessCapabilities = await conference.loadRouterRtpCapabilities(); // Boolean
if(!accessCapabilities){
  console.log("Your device cannot support WebRTC.");
  return;
}
```

- Build WebRTC transport (send (true) and receive (false))

```javascript
// 'true' means send (Actually it is OK to only use send because sdk already handles receive transport)
await conference.handleTransport(true);
```

- Join room

```javascript
// joinInfo returns all the datas about the room
const joinInfo = await conference.join();
console.log(joinInfo);
```

example joinInfo:

```javascript
{
    "roles": [
        "normal"
    ],
    "peers": [ // 不包括自己
        {
            "id": "2rg1o7qi",
            "displayName": "Guest",
            "picture": null,
            "roles": [
                "normal",
                "super_moderator"
            ],
            "raisedHand": false,
            "raisedHandTimestamp": null
        }
    ],
    "tracker": "wss://wttracker-tw2.meshstream.io:443",
    "authenticated": false,
    "roomPermissions": {
        "CHANGE_ROOM_LOCK": [
            "super_moderator",
            "co_moderator"
        ],
        "PROMOTE_PEER": [
            "super_moderator",
            "co_moderator"
        ],
        "SEND_CHAT": [
            "normal"
        ],
        "MODERATE_CHAT": [
            "super_moderator",
            "co_moderator"
        ],
        "SHARE_SCREEN": [
            "normal"
        ],
        "EXTRA_VIDEO": [
            "normal"
        ],
        "SHARE_FILE": [
            "normal"
        ],
        "MODERATE_FILES": [
            "super_moderator",
            "co_moderator"
        ],
        "MODERATE_ROOM": [
            "super_moderator",
            "co_moderator"
        ],
        "MODERATE_ROLE": [
            "super_moderator"
        ],
        "MODERATE_MEETING": [
            "super_moderator"
        ]
    },
    "userRoles": {
        "ADMIN": "admin",
        "SUPER_MODERATOR": "super_moderator",
        "CO_MODERATOR": "co_moderator",
        "PRESENTER": "presenter",
        "AUTHENTICATED": "authenticated",
        "NORMAL": "normal"
    },
    "allowWhenRoleMissing": [
        "CHANGE_ROOM_LOCK"
    ],
    "chatHistory": [
        {
            "name": "Guest",
            "peerId": "2rg1o7qi",
            "picture": null,
            "sender": "response",
            "text": "jel",
            "time": 1623815666934,
            "type": "message"
        }
    ],
    "fileHistory": [
        {
            "peerId": "2rg1o7qi",
            "magnetUri": "magnet:?xt=urn:btih:8e803af1d448b2069dec754e728ef02ef1bc2fe6&dn=20210106_Meshub_%E5%A0%B1%E5%83%B9%E5%96%AE.pdf&tr=wss%3A%2F%2Fwttracker-tw2.meshstream.io%3A443"
        }
    ],
    "lastNHistory": [
        "2rg1o7qi",
        "85sfxm8w"
    ],
    "locked": false,
    "lobbyPeers": [],
    "accessCode": "",
    "defaultMute": false,
    "defaultCanShareScreen": true,
    "defaultCanUnmute": true
}
```

- lock or unlockRoom

```javascript
await conference.lockRoom();
await conference.unlockRoom();
```

- promotePeer (允許大廳的 peer 進入被鎖上的房間)

```javascript
await conference.promotePeer(peerId)
```

- promoteAllPeers (允許大廳的所有 peer 進入被鎖上的房間)

```javascript
await conference.promoteAllPeers()
```

- sendMessage

```javascript
const message = await conference.sendMessage(text)
/*
  data interface: (依目前的功能，應該只需要 name, text, time)

  {
    name, 
    picture,
    sender,
    text,
    time,
    type
  }
*/
```

- raiseHand, putDownHand

```javascript
await conference.raiseHand();
await conference.putDownHand();
```

- pinPeer, unpinPeer

```javascript
await conference.pinPeer(peerId);
await conference.unpinPeer(peerId);
```

- produce your webcam and mic

```javascript
await conference.produce(audioTrack, {
  source: 'mic'
});
await conference.produce(webcamTrack, {
  source: 'webcam'
});
```

- screen share
  - produce shared screen

    ```javascript
    await conference.produce(captureStreamTrack,{
      source : 'screen'
    });
    ```
  
  - close shared screen

    ```javascript
    await conference.closeSharedScreen()
    ```

- mic
  - close your mic

    ```javascript
    await conference.closeMic();
    ```

  - pause your mic 

    ```javascript
    await conference.pauseMic();
    ```
  
  - resume your mic

    ```javascript
    await conference.resumeMic();
    ```

- webcam (For user experience, there's no pauseWebcam in sdk)
  - close your webcam

    ```javascript
    await conference.closeWebcam();
    ```

  - restart your webcam ( same as producing your webcam)

    ```javascript
    await conference.produce(webcamTrack, {
      source: 'webcam'
    });
    ```

- listen to incoming events

```javascript
conference
  .on('unauthorized', reason => {
    console.log("Unauthoized:", reason);
  })
  .on('noDecision', err => {
    /* 當 conference object 帶入的 create 不是 boolean 時 */
  })
  .on('create:duplicatedRoom', err => {
    /* 當選擇 create room，但 roomId 已經被使用過 */
  })
  .on('join:roomNotExist', err => {
    /* 當選擇 join room，但 room 並不存在 */
  })
  .on('disconnect', reason => {
    /* 如果 reason 不是 "io server disconnect"，則會視為嘗試重新連接 */
  })
  .on('reconnect', () => {

  })
  .on('reconnect_failed', () => {
    
  })
  .on('waitInLobby', () => {
    alert('The room is locked. Wait in lobby');
  })
  .on('roomReady', () => {
    /* 為了區隔掉 lobbyPeer，當觸發 roomReady event 時，peer 才會正式進入 room */
    //...
  })
  .on('roomLocked', ({ peerId }) => {
    console.log(`Room is locked by ${peerId}`);
  })
  .on('roomUnlocked', ({ peerId }) => {
    console.log(`Room is unlocked by ${peerId}`);
  })
  .on('newLobbyPeer', ({ peerId, displayName }) => {
    console.log("new lobby peer parked:", { peerId, displayName })
  })
  .on('lobbyPeerLeaved', ({ peerId }) => {
    console.log("leaved lobby peer id:", peerId);
  })
  .on('approvedLobbyPeer', ({ peerId }) => {
    console.log("approved lobby peer id:", peerId);
  })
  .on('peerChatMessage', ({ peerId, chatMessage }) => {
    /*
      data interface for chatMessage: (依目前的功能，應該只需要 name, text, time)

      {
        name: string, 
        picture: string,
        sender: string,
        text: string,
        time: date,
        type: string
      }
    */
  })
  .on('peerRaisedHand', ({ peerId, raisedHandTimestamp }) => {
    //...
  })
  .on('peerPutDownHand', ({ peerId }) => {
    //...
  })
  .on('personalData', ({ peerId, displayName, roles }) => {
    /*
      example: 
      {
        peerId: "ufrgb3fg",
        displayName: "yachen",
        roles: [ 'normal', 'super_moderator' ] 
      }
    */
    console.log("Personal data: ", { peerId, displayName, roles })
  })
  .on('addtrack', ({ track, displayName, peerId, source }) => {
    /*
      {
        track: MediaStreamTrack, 
        displayName: string,
        peerId: string,
        source: string
      }
    */
  })
  .on('removetrack', ({ track, displayName, peerId, source }) => {
    /*
      {
        track: MediaStreamTrack, 
        displayName: string,
        peerId: string,
        source: string
      }
    */
  })
  .on('newPeer', ({ peerId, displayName, picture, roles }) => {
    /* 這裡的 picture 目前先不用管它 */
    console.log("Joined peer:", { peerId, displayName, picture, roles });
    // ...
  })
  .on('activeSpeaker', ({ peerId, volume, numOfPeers }) => {
    /* volume 都是負數，負數的數字越小代表越大聲 */
    console.log("active Speaker:", { peerId, volume, numOfPeers });
    // ...
  })
  .on('producerScore', ({ source, score }) => {
    console.log('Producer score:', { source, score })
  })
  .on('consumerScore', ({ peerId, source, score }) => {
    console.log('Consumer score:', { peerId, source, score })
  })
  .on('peerClosed', ({ closedPeerId }) => {
    console.log("Closed peer", closedPeerId);
  })
  .on('listAllDevices', ({ webcamDevices, audioInputDevices, audioOutputDevices }) => {
    /*
      {
        webcamDevices: MediaDeviceInfo, 
        audioInputDevices: MediaDeviceInfo,
        audioOutputDevices: MediaDeviceInfo,
      }
    */
    console.log('All Devices:', { webcamDevices, audioInputDevices, audioOutputDevices })
  })
  .on('updateDevices', ({ webcamDevices, audioInputDevices, audioOutputDevices }) => {
    /*
      {
        webcamDevices: MediaDeviceInfo, 
        audioInputDevices: MediaDeviceInfo,
        audioOutputDevices: MediaDeviceInfo,
      }
    */
    console.log('Updated devices:', { webcamDevices, audioInputDevices, audioOutputDevices })
  })
  .on('resolutionChange', ({ increase }) => {
    /*
      The type of increase is boolean:
        true: increase resolution,
        false: decrease resolution
    */
  })
  .on('numOfPeers:gt', ({ numOfPeers }) => {
    console.log(`num of peers are > ${numOfPeers}`)
  })
  .on('numOfPeers:lte', ({ numOfPeers }) => {
    console.log(`num of peers are ≤ ${numOfPeers}`)
  })
  .on('micTrackended' () => {
    
  })
  .on('permissionError', ({ event, yourRoles, permittedRoles }) => {
    /*
    ex: 
      {
        "event": "lockRoom",
        "yourRoles": [
            "normal"
        ],
        "permittedRoles": [
            "super_moderator",
            "co_moderator"
        ]
      }
    */
  })
  .on("superModerator:setRoomDefaultMute", ({ mute }) => {
    /* mute 為 boolean 值，true 為靜音 ; false 為取消靜音 */
  })
  .on("superModerator:promotePeerError", ({ event, expectedPeerRole, actualPeerRole }) => {
    /*
      當 promote 的 peer 的 role 不是 normal 時
      ex:
      {
          "event": "superModerator:promotePeer",
          "expectedPeerRole": [
              "normal"
          ],
          "actualPeerRole": [
              "normal",
              "co_moderator"
          ]
      }
    */

  })
  .on("superModerator:demotePeerError", ({ event, expectedPeerRole, actualPeerRole }) => {
    /*
      當 demote 的 peer 的 role 不是 co_moderator 時
      ex:
      {
          "event": "superModerator:demotePeer",
          "expectedPeerRole": [
              "co_moderator"
          ],
          "actualPeerRole": [
              "normal"
          ]
      }
    */
  })
  .on("moderator:mute", () => {
    /* <p.s.> 這個 event 的功能只是提醒前端，前端要自己 pauseMic() */
  })
  .on("moderator:unmute", () => {
    /* <p.s.> 這個 event 的功能只是提醒前端，前端要自己 resumeMic() */
  })
  .on("moderator:lowerHand", () => {
    /* <p.s.> 實際上 lowerHand 已經在 sdk 完成，這個 event 的功能只是提醒前端改 lowerHand 的 UI 而已 */
  })
  .on("moderator:kickPeer", () => {
    /* 這個 event 也只是提醒前端而已，前端收到後再自己 leaveRoom() */
  })
  .on("gotRole", ({ role }) => {
    /* 偵測 "自己" 得到 role */
  })
  .on("lostRole", ({ role }) => {
    /* 偵測 "自己" 失去 role */
  })
  .on("peerGotRole", ({ peerId, role }) => {
    /* 偵測 "其他 peer" 得到 role */
  })
  .on("peerLostRole", ({ peerId, role }) => {
    /* 偵測 "其他 peer" 失去 role */
  })
  .on("superModerator:setRoomDefaultCanShareScreen", ({ canShareScreen }) => {
    /* canShareScreen 為 boolean 值，true 為可以分享螢幕 ; false 為不能分享螢幕 */
  })
  .on("moderator:stopScreenSharing", () => {
    /* <p.s.> 這個 event 的功能只是提醒前端，前端再自己 closeSharedScreen() */
  })
  .on("superModerator:setRoomDefaultCanUnmute", ({ canUnmute }) => {
    /* canUnmute 為 boolean 值，true 為可以取消靜音或者 produce mic ; false 為不能取消靜音或者 produce mic */
  })
  .on("superModerator:closeMeeting", () => {
    /* <p.s.> 這個 event 的功能只是提醒前端，前端再自己 leaveRoom() */
  })
  .on("moderatorMutedPeers", ({ moderatorMutedPeers }) => {
    /* moderatorMutedPeers 為一個 peerId 的 array */
  })
```

- control consumer medias (only works on you, not all the members in this room)
  - pause consumer

    ```javascript
    await conference.resumeConsumer(peerId, source);
    ```
  - resume consumer

    ```javascript
    await conference.pauseConsumer(peerId, source);
    ```

- leave room

  There are actually two ways to leave room successfully
  
  - reload or close the page ( This will cause both recvTransport and sendTransport closed )
  - call leaveRoom()

  ```javascript
    conference.leaveRoom();
  ```

- moderator events:
  - mutePeer / unmutePeer

    ```javascript
      await conference.mutePeer(peerId)
      await conference.unmutePeer(peerId)
    ```

  - muteAllPeers / unmuteAllPeers

    ```javascript
      await conference.muteAllPeers()
      await conference.unmuteAllPeers()
    ```

  - lowerHand

    ```javascript
      await conference.lowerHand(peerId)
    ```

  - lowerHandAll

    ```javascript
      await conference.lowerHandAll()
    ```
  
  - kickPeer

    ```javascript
      await conference.kickPeer(peerId)
    ```
  
  - promotePeerToCoModerator / demotePeerToNormal

    ```javascript
      await conference.promotePeerToCoModerator(peerId)
      await conference.demotePeerToNormal(peerId)
    ```

  - setRoomDefaultMute

    ```javascript
      // 靜音
      await conference.setRoomDefaultMute(true)
      // 取消靜音
      await conference.setRoomDefaultMute(false)
    ```
  
  - transferSuperModerator

    ```javascript
      await conference.transferSuperModerator(peerId)
    ```

  - closeMeeting

    ```javascript
      await conference.closeMeeting();
    ```
  
  - setRoomDefaultCanShareScreen

    ```javascript
      // 不能分享螢幕
      await conference.setRoomDefaultCanShareScreen(false)
      // 可以分享螢幕
      await conference.setRoomDefaultCanShareScreen(true)
    ```

  - closePeerScreenSharing

    ```javascript
      await conference.closePeerScreenSharing(peerId)
    ```

  - closeAllScreenSharing

    ```javascript
      await conference.closeAllScreenSharing()
    ```

  - setRoomDefaultCanUnmute

    ```javascript
      // 不能 unmute 或者 produce mic
      await conference.setRoomDefaultCanUnmute(false)
      // 可以 unmute 或者 produce mic
      await conference.setRoomDefaultCanUnmute(true)
    ```
