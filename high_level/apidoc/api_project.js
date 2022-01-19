define({
  "name": "Meshstream SDK",
  "version": "2.0.0",
  "description": "Meshstream Restful 與 SocketIO API",
  "title": "Meshub High Level SDK",
  "url": "https://api.meshstream.io/v2",
  "order": [
    "Auth",
    "Project",
    "Room",
    "Log",
    "System"
  ],
  "header": {
    "title": "Introduction",
    "content": "<h2>使用 Meshstream SDK 主流程</h2>\n<ol>\n<li>到 dashboard.meshstream.io 申請帳號</li>\n<li>從 dashboard 建立專案，取得ProjId</li>\n<li>透過 dashboard 或 API 建立會議，取得會議連結</li>\n<li>將Meshstream Web SDK以iframe方式嵌入活動網頁中</li>\n<li>透過dashboard或API檢視/取得即時觀看資訊，亦可事後取得。</li>\n<li>透過dashboard或API檢視資訊</li>\n<li>透過dashboard檢視帳單與儲值</li>\n</ol>\n<h2>API 類別</h2>\n<ol>\n<li>認證</li>\n<li>專案管理</li>\n<li>會議室管理</li>\n<li>會議室使用資訊\n<ul>\n<li>使用者</li>\n<li>頻寬</li>\n</ul>\n</li>\n<li>費用</li>\n<li>系統狀態</li>\n</ol>\n<h2>Web SDK的整合</h2>\n<ol>\n<li>從Dashboard/API取得會議連結</li>\n<li>會議參數\n<ul>\n<li>個人參數：透過Query string取得\n<ul>\n<li>roomId, user name, token, hmac</li>\n</ul>\n</li>\n<li>會議室參數：roomId從後台取得room參數。從Dashboard或是API來設定\n<ul>\n<li>logo</li>\n<li>是否証認</li>\n<li>room 功能參數 (是否開啟某些功能、room的layout)</li>\n</ul>\n</li>\n</ul>\n</li>\n<li>使用者認證流程</li>\n<li>防盜連</li>\n</ol>\n<p><img src=\"./major_flow.svg\" alt=\"image info\"></p>\n<h2>Meshstream API使用認證機制</h2>\n<ol>\n<li>先用帳密登入，支援2FA</li>\n<li>可使用Meshstream API Server鎖ip</li>\n<li>可設定可使用API的角色與權限</li>\n</ol>\n<h2>會議室生命週期</h2>\n<ol>\n<li>會議未開啟</li>\n<li>會議中，有主持人</li>\n<li>會議中，無主持人</li>\n<li>會議中，無與會人員</li>\n<li>會議結束</li>\n</ol>\n<p><img src=\"./room_lifecycle.svg\" alt=\"image info\"></p>\n"
  },
  "footer": {
    "title": "Error code",
    "content": "<h1>Error Code</h1>\n<table>\n    <tr><td>Code</td><td>Error</td></tr>\n    <tr><td>100</td><td>User not found</td></tr>\n</table>\n"
  },
  "sampleUrl": false,
  "defaultVersion": "0.0.0",
  "apidoc": "0.3.0",
  "generator": {
    "name": "apidoc",
    "time": "2021-12-13T03:02:58.721Z",
    "url": "http://apidocjs.com",
    "version": "0.20.0"
  }
});
