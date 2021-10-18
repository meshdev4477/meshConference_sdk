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
// JoinInfo returns all the datas about the room.
const joinInfo = await conference.join();
console.log(joinInfo);
```

example joinInfo:

```javascript
{
    "roles": [
        "normal"
    ],
    "peers": [
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

- wait for incoming events

```javascript
conference
  .on('unauthorized', reason => {
    console.log("Unauthoized:", reason);
  })
  .on('addtrack', ({track, displayName, peerId, source}) => {
    addRemoteMedia(track, peerId, source);
  })
  .on('removetrack', ({track, displayName, peerId, source}) => {
    removeRemoteMedia(track, peerId, source);
  })
  .on('newPeer', ({ peerId, displayName, picture, roles }) => {
    console.log("Joined peer:", { peerId, displayName, picture, roles });
    // ...
  })
  .on('peerClosed', ({ closedPeerId }) => {
    console.log("Closed peer", closedPeerId);
    removeAllMediaElementsFromThePeer(closedPeerId);
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