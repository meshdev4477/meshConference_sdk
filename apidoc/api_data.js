define({ "api": [
  {
    "type": "post",
    "url": "/login",
    "title": "Login",
    "group": "Auth",
    "permission": [
      {
        "name": "none"
      }
    ],
    "version": "2.0.0",
    "description": "<p>使用者登入, 支援鎖ip與2FA。使用者分為admin與staff，staff由admin設定權限，設定可使用的範圍(project, room)。從Meshstream dashboard中設定。</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "username",
            "description": "<p>使用者名稱</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "password",
            "description": "<p>使用者密碼</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "name",
            "description": "<p>The user's name.</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "token",
            "description": "<p>jwt token</p>"
          },
          {
            "group": "Success 200",
            "type": "[string]",
            "optional": false,
            "field": "last_5_login",
            "description": "<p>Last 5 time login time, in UTC.</p>"
          }
        ]
      }
    },
    "filename": "high_level/apidoc_src/apidoc.js",
    "groupTitle": "Auth",
    "name": "PostLogin",
    "error": {
      "fields": {
        "Error": [
          {
            "group": "Error",
            "type": "int",
            "optional": false,
            "field": "code",
            "description": "<p>Error code</p>"
          },
          {
            "group": "Error",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Error message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 200 OK\n{\n     \"code\": 100,\n     \"message\": \"User not found\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/logout",
    "title": "Logout",
    "group": "Auth",
    "permission": [
      {
        "name": "none"
      }
    ],
    "version": "2.0.0",
    "description": "<p>Logout</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "int",
            "optional": false,
            "field": "status",
            "description": "<p>0: fail 1: success</p>"
          }
        ]
      }
    },
    "filename": "high_level/apidoc_src/apidoc.js",
    "groupTitle": "Auth",
    "name": "PostLogout"
  },
  {
    "type": "post",
    "url": "/refresh",
    "title": "Refresh",
    "group": "Auth",
    "permission": [
      {
        "name": "login user"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer + token</p>"
          }
        ]
      }
    },
    "version": "2.0.0",
    "description": "<p>更新jwt token</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "name",
            "description": "<p>The user's name.</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "token",
            "description": "<p>jwt token</p>"
          }
        ]
      }
    },
    "filename": "high_level/apidoc_src/apidoc.js",
    "groupTitle": "Auth",
    "name": "PostRefresh",
    "error": {
      "fields": {
        "Error": [
          {
            "group": "Error",
            "type": "int",
            "optional": false,
            "field": "code",
            "description": "<p>Error code</p>"
          },
          {
            "group": "Error",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Error message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 200 OK\n{\n     \"code\": 100,\n     \"message\": \"User not found\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/log/:roomId",
    "title": "Get room log",
    "group": "Log",
    "permission": [
      {
        "name": "staff with permission of this room"
      }
    ],
    "version": "2.5.0",
    "description": "<p>Will support get log of room</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "param",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "param.roomId",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "param.startTime",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "param.endTime",
            "description": ""
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "log",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "time",
            "description": ""
          }
        ]
      }
    },
    "filename": "high_level/apidoc_src/apidoc.js",
    "groupTitle": "Log",
    "name": "PostLogRoomid"
  },
  {
    "type": "post",
    "url": "/log/rt/:roomId",
    "title": "Get real time log",
    "group": "Log",
    "version": "2.5.0",
    "permission": [
      {
        "name": "staff with permission of this room"
      }
    ],
    "description": "<p>Will support Socket.io to provide real time log</p>",
    "filename": "high_level/apidoc_src/apidoc.js",
    "groupTitle": "Log",
    "name": "PostLogRtRoomid"
  },
  {
    "type": "get",
    "url": "/proejct",
    "title": "List projects",
    "group": "Project",
    "permission": [
      {
        "name": "staff with permission of projectId"
      }
    ],
    "version": "2.0.0",
    "description": "<p>List projects, 取得權限內可讀的project與屬性</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "proj",
            "description": "<p>Array of projects</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "proj.name",
            "description": "<p>Project name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "proj.projId",
            "description": "<p>Project id</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "proj.staff",
            "description": "<p>Staff allowed to access this project</p>"
          }
        ]
      }
    },
    "filename": "high_level/apidoc_src/apidoc.js",
    "groupTitle": "Project",
    "name": "GetProejct"
  },
  {
    "type": "get",
    "url": "/proejct/:projectId",
    "title": "List one project",
    "group": "Project",
    "permission": [
      {
        "name": "staff with permission of projectId"
      }
    ],
    "version": "2.0.0",
    "description": "<p>Get project property</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer + token</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"Authorization\": \"Bearer token\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "proj",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "proj.name",
            "description": "<p>Project name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "proj.projId",
            "description": "<p>Project id</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "proj.staff",
            "description": "<p>Staff allowed to access this project</p>"
          }
        ]
      }
    },
    "filename": "high_level/apidoc_src/apidoc.js",
    "groupTitle": "Project",
    "name": "GetProejctProjectid"
  },
  {
    "type": "post",
    "url": "/proj/create",
    "title": "Create",
    "group": "Project",
    "version": "2.0.0",
    "permission": [
      {
        "name": "admin"
      }
    ],
    "description": "<p>Create Project</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "param",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "param.name",
            "description": "<p>Project name</p>"
          },
          {
            "group": "Parameter",
            "type": "String[]",
            "optional": false,
            "field": "param.staff",
            "description": "<p>Staff allowed to access this project</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "proj",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "proj.projId",
            "description": "<p>Room id</p>"
          }
        ]
      }
    },
    "filename": "high_level/apidoc_src/apidoc.js",
    "groupTitle": "Project",
    "name": "PostProjCreate"
  },
  {
    "type": "post",
    "url": "/proj/:id",
    "title": "Update",
    "group": "Project",
    "permission": [
      {
        "name": "staff with permission of projectId"
      }
    ],
    "version": "2.0.0",
    "description": "<p>Update Project</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "proj",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "proj.name",
            "description": "<p>Project name</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "proj.projId",
            "description": "<p>Project id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "proj.name",
            "description": "<p>Project name</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "proj.staff",
            "description": "<p>Staff allowed to access this project</p>"
          }
        ]
      }
    },
    "filename": "high_level/apidoc_src/apidoc.js",
    "groupTitle": "Project",
    "name": "PostProjId"
  },
  {
    "type": "post",
    "url": "/proj/staff/:id",
    "title": "Set staff",
    "group": "Project",
    "permission": [
      {
        "name": "staff with permission of projectId"
      }
    ],
    "version": "2.0.0",
    "description": "<p>Set staff of project</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "staffs",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "String[]",
            "optional": false,
            "field": "staffs.email",
            "description": "<p>Array of email of user allow to access this room</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "staff",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "staff.email",
            "description": "<p>Array of email of user allow to access this room</p>"
          }
        ]
      }
    },
    "filename": "high_level/apidoc_src/apidoc.js",
    "groupTitle": "Project",
    "name": "PostProjStaffId"
  },
  {
    "type": "get",
    "url": "/room",
    "title": "List rooms",
    "group": "Room",
    "permission": [
      {
        "name": "staff with permission of roomId"
      }
    ],
    "version": "2.0.0",
    "description": "<p>取得權限內可讀的room與屬性</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "room",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "room.roomId",
            "description": "<p>Room id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "room.url",
            "description": "<p>Room Url, url to embed Web SDK</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "room.name",
            "description": "<p>Room name</p>"
          },
          {
            "group": "Success 200",
            "type": "boolean",
            "optional": false,
            "field": "room.checkToken",
            "description": "<p>Check token, if true, urlTocheckToken is required</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "room.urlToCheckToken",
            "description": "<p>Url to check user token</p>"
          }
        ]
      }
    },
    "filename": "high_level/apidoc_src/apidoc.js",
    "groupTitle": "Room",
    "name": "GetRoom"
  },
  {
    "type": "get",
    "url": "/room/:id",
    "title": "List one room",
    "group": "Room",
    "permission": [
      {
        "name": "staff with permission of roomId"
      }
    ],
    "version": "2.0.0",
    "description": "<p>List one room</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "room",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "room.roomId",
            "description": "<p>Room id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "room.url",
            "description": "<p>Room Url, url to embed Web SDK</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "room.name",
            "description": "<p>Room name</p>"
          },
          {
            "group": "Success 200",
            "type": "boolean",
            "optional": false,
            "field": "room.checkToken",
            "description": "<p>Check token</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "room.urlToCheckToken",
            "description": "<p>Url to check user token</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "room.staffs",
            "description": "<p>Staff allowed to access this room, account name/email</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "param.logoUrl",
            "description": "<p>Logo url</p>"
          },
          {
            "group": "Success 200",
            "type": "boolean",
            "optional": false,
            "field": "param.pushToYouTube",
            "description": "<p>Push to YouTube or not</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "param.ytParams",
            "description": "<p>Parameters to push to youtube, TBD</p>"
          }
        ]
      }
    },
    "filename": "high_level/apidoc_src/apidoc.js",
    "groupTitle": "Room",
    "name": "GetRoomId"
  },
  {
    "type": "get",
    "url": "/room/option/:id",
    "title": "Room option",
    "group": "Room",
    "permission": [
      {
        "name": "none, for Web SDK"
      }
    ],
    "version": "2.0.0",
    "description": "<p>Get Room option</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "room",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "room.roomId",
            "description": "<p>Room id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "room.url",
            "description": "<p>Room Url, url to embed Web SDK</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "room.name",
            "description": "<p>Room name</p>"
          },
          {
            "group": "Success 200",
            "type": "boolean",
            "optional": false,
            "field": "room.checkToken",
            "description": "<p>Check token, if true, urlTocheckToken is required</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "room.urlToCheckToken",
            "description": "<p>Url to check user token</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "param.logoUrl",
            "description": "<p>Logo url</p>"
          },
          {
            "group": "Success 200",
            "type": "boolean",
            "optional": false,
            "field": "param.pushToYouTube",
            "description": "<p>Push to YouTube or not</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "param.ytParams",
            "description": "<p>Parameters to push to youtube, TBD</p>"
          }
        ]
      }
    },
    "filename": "high_level/apidoc_src/apidoc.js",
    "groupTitle": "Room",
    "name": "GetRoomOptionId"
  },
  {
    "type": "post",
    "url": "/room/create",
    "title": "Create",
    "group": "Room",
    "version": "2.0.0",
    "permission": [
      {
        "name": "staff with permission to create room in projectId"
      }
    ],
    "description": "<p>Create Room</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "param",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "param.name",
            "description": "<p>Room name</p>"
          },
          {
            "group": "Parameter",
            "type": "boolean",
            "optional": false,
            "field": "param.checkToken",
            "description": "<p>Check token</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "param.urlToCheckToken",
            "description": "<p>Url to check user token</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "param.videoQuality",
            "description": "<p>Default video quality, quality values TBD</p>"
          },
          {
            "group": "Parameter",
            "type": "String[]",
            "optional": false,
            "field": "param.staff",
            "description": "<p>Staff allowed to access this room</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "param.logoUrl",
            "description": "<p>Logo url</p>"
          },
          {
            "group": "Parameter",
            "type": "boolean",
            "optional": false,
            "field": "param.pushToYouTube",
            "description": "<p>Push to YouTube or not</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "param.ytParams",
            "description": "<p>Parameters to push to youtube, TBD</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "room",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "room.roomId",
            "description": "<p>Room id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "room.url",
            "description": "<p>Room Url, url to embed Web SDK</p>"
          }
        ]
      }
    },
    "filename": "high_level/apidoc_src/apidoc.js",
    "groupTitle": "Room",
    "name": "PostRoomCreate"
  },
  {
    "type": "post",
    "url": "/room/:id",
    "title": "Update",
    "group": "Room",
    "permission": [
      {
        "name": "staff with permission of roomId"
      }
    ],
    "version": "2.0.0",
    "description": "<p>Update Room</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "room",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "room.name",
            "description": "<p>Room name</p>"
          },
          {
            "group": "Parameter",
            "type": "boolean",
            "optional": false,
            "field": "room.checkToken",
            "description": "<p>Check token, if true, urlTocheckToken is required</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "room.urlToCheckToken",
            "description": "<p>Url to check user token</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "param.logoUrl",
            "description": "<p>Logo url</p>"
          },
          {
            "group": "Parameter",
            "type": "boolean",
            "optional": false,
            "field": "param.pushToYouTube",
            "description": "<p>Push to YouTube or not</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "param.ytParams",
            "description": "<p>Parameters to push to youtube, TBD</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "room.roomId",
            "description": "<p>Room id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "room.url",
            "description": "<p>Room Url, url to embed Web SDK</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "room.name",
            "description": "<p>Room name</p>"
          },
          {
            "group": "Success 200",
            "type": "boolean",
            "optional": false,
            "field": "room.checkToken",
            "description": "<p>Check token, if true, urlTocheckToken is required</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "room.urlToCheckToken",
            "description": "<p>Url to check user token</p>"
          }
        ]
      }
    },
    "filename": "high_level/apidoc_src/apidoc.js",
    "groupTitle": "Room",
    "name": "PostRoomId"
  },
  {
    "type": "post",
    "url": "/room/staff/:id",
    "title": "Set staff",
    "group": "Room",
    "permission": [
      {
        "name": "staff with permission of roomId"
      }
    ],
    "version": "2.0.0",
    "description": "<p>List one room</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "staffs",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "String[]",
            "optional": false,
            "field": "staffs.email",
            "description": "<p>Array of email of user allow to access this room</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "staffs",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "staff.email",
            "description": "<p>Array of email of user allow to access this room</p>"
          }
        ]
      }
    },
    "filename": "high_level/apidoc_src/apidoc.js",
    "groupTitle": "Room",
    "name": "PostRoomStaffId"
  },
  {
    "type": "get",
    "url": "/system/status",
    "title": "Get System Status",
    "permission": [
      {
        "name": "none"
      }
    ],
    "name": "GetStatus",
    "group": "System",
    "version": "2.0.0",
    "description": "<p>Returns the current system status.</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "int",
            "optional": false,
            "field": "status",
            "description": "<p>0: error, 1: success.</p>"
          }
        ]
      }
    },
    "filename": "high_level/apidoc_src/apidoc.js",
    "groupTitle": "System"
  }
] });
