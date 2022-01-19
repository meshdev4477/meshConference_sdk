const axios = require('axios').default;
const open = require('open');

console.log('Meshstream API Sample');


let ServerUrl ="https://api.meshstream.io"
// userAccount, userPassword, projectId 
// 請先跟 service@meshub.io 申請帳號後取得
let userAccount ="";
let userPassword ="";  
let projectId="";


//init Room option
function initRoomOption ()
{
  var ui = new Object();
  ui.primaryColor="#71c9e9";
  ui.primaryFontColor="#000000";
  ui.secondaryColor="#ffffff";
  ui.secondaryFontColor="#000000";
  ui.defaultLayout="auto";
  ui.notificationPosition="rightTop";
  ui.enableChatroom=true;
  ui.enableWhiteboard=true;
  ui.enableRecording=true;
  ui.enableFileSharing=true;
  ui.enableScreenSharing=true;
  ui.allowAttendeesUnmuteThemselves=true;
  ui.openCameraOnEntry=false;
  ui.openMicOnEntry=true;

  var youtubeSetting= new Object();
  youtubeSetting.pushYoutube=false;
  youtubeSetting.ytParams= {
    publish_url: "",
    view_url: "",
    stream_key: ""
  };
  var roomOption = new Object();
  roomOption.ui = ui;
  roomOption.youtubeSetting=youtubeSetting;
  return roomOption;

}

async function Login(account,password){
  var token =""
  await axios
  .post(ServerUrl+'/v2/login', {
    account: account,
    password:password
  })
  .then(res => {
    token = res.data["token"]
  })
  .catch(error => {
    console.error(error)
  })
  return token
}



async function CreateProject(token,ProjectName,staffs,roomOption){
  var roomId ="";
  const auth = {headers: {Authorization:'Bearer ' + token} }
  await axios
  .post(ServerUrl+'/v2/project/', 
    { project:projectId,
      staff:staffs,
      name:ProjectName,
        option:roomOption
      },
  auth)
  .then(res => {
    ProjectId = res.data["projectItem"]["projectId"]
  })
  .catch(error => {
    console.error(error)
  })

  return ProjectId
}



async function CreateRoom(token,projectId,roomName,roomOption,duration){
  var roomId ="";
  const auth = {headers: {Authorization:'Bearer ' + token} }
  await axios
  .post(ServerUrl+'/v2/project/rooms', 
    { projectId:projectId,
      room:{ 
        name:roomName,
        option:roomOption,
        duration:duration
      }},
  auth)
  .then(res => {
    roomId = res.data["roomItem"]["roomId"]
  })
  .catch(error => {
    console.error(error)
  })

  return roomId
}

async function GetRoomUrl(token,roomId){
  var url=""
  const auth = {headers: {Authorization:'Bearer ' + token} }
  console.log(roomId)
  await axios
 .get(ServerUrl+'/v2/project/room/url/'+roomId+"?NeedAuth=true",
  auth)
  .then(res => {
    url =res.data["url"]
  })
  .catch(error => {
    console.error(error)
    //TODO err create project
  })
  return url
}

function dateTimeFormating (date)
{

  return dateString;
}



async function Exec (){

  // Step 1: Login ,須先取得測試帳號
  var token = await Login(userAccount,userPassword)

  // Step 2: Create Room , 須先取得Project ID
  var roomOption = initRoomOption();
  let roomName = "Sync Up Meeting";


  //會議時間區間為 Now, Now add one hour.
  var duration= new Object();
  var now =new Date();
  duration.begin_time=now.toISOString();
  const end_time = new Date(now);
  end_time.setHours(end_time.getHours() + 1);
  duration.end_time=end_time.toISOString();

  //客製化風格示範
 // roomOption.ui.logoUrl="https://meshub.io/static/media/logo.293c4ef3.webp";
 // roomOption.ui.primaryColor="#ff0000";


  
  var roomId = await CreateRoom(token,projectId,roomName,roomOption,duration)

  // Step 3: GetRoomUrl，實際流程為客戶端啟動，在這邊實作是為了整體流程展現。
  var url = await GetRoomUrl(token,roomId)

  // Step 4: Launch Room with default Browser，實際流程為客戶端啟動，在這邊實作是為了整體流程展現。
  open(url)

  // Step 5 : Launch Ｒoom with Secondary Browser，實際流程為客戶端啟動，在這邊實作是為了整體流程展現。
  //var roomUrl = "https://conference.meshstream.io/"+roomId;
  //open(roomUrl, {app: {name: 'safari'}});

} 

Exec()

