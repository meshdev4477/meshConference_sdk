# Roles & Permissions
roles (order by level desc) : 
  - SUPER_MODERATOR ( there is only one SUPER_MODERATOR in a room )
  - CO_MODERATOR ( there may be many OC_MODERATORs in a room )
  - NORMAL

permission lists (only list the methods that not all roles are permitted):

| method | available roles |
| ---- | ---- |
| mutePeer / unmutePeer | SUPER_MODERATOR, CO_MODERATOR |
| muteAllPeers / unmuteAllPeers | SUPER_MODERATOR, CO_MODERATOR |
| closePeerScreenSharing / closeAllScreenSharing | SUPER_MODERATOR, CO_MODERATOR |
| lowerHand / lowerHandAll | SUPER_MODERATOR, CO_MODERATOR |
| kickPeer | SUPER_MODERATOR, CO_MODERATOR |
| promotePeerToCoModerator / demotePeerToNormal | SUPER_MODERATOR |
| setRoomDefaultMute | SUPER_MODERATOR |
| setRoomDefaultCanUnmute | SUPER_MODERATOR |
| setRoomDefaultCanShareScreen | SUPER_MODERATOR |
| transferSuperModerator | SUPER_MODERATOR |


```
<p.s.> SUPER_MODERATORs can also do something (both SUPER_MODERATOR and CO_MODERATOR are permitted) to CO_MODERATORs, but not vice versa.

  ex: SUPER_MODERATORs can also mute CO_MODERATORs, but CO_MODERATORs cannot mute SUPER_MODERATORs or other CO_MODERATORs.
```