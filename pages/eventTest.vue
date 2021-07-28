<template>
  <v-container id="form-container">
    <v-form id="channel-name"><h1> Channel Name: demoChannel </h1></v-form>

    <v-form id="login-form">
      <input class="text-field" type="text" placeholder="User ID" id="userID"/>
      <v-btn color="primary" id="login" @click="loginUser">LOGIN</v-btn>
      <v-btn type="button" id="logout" @click="logoutUser">LOGOUT</v-btn>
    </v-form>

    <v-form id="member-form">
      <h3>MEMBER</h3>
      <ul v-for="(member) of userList">
        <li>{{member}}</li>
      </ul>
    </v-form>

    <v-form id="log-form">
      <h3>STATE</h3>
      <div id="log"></div>
    </v-form>

    <v-form id="event-form">
      <div id="event" @mousemove="mousePosition"></div>
    </v-form>
  </v-container>
</template>

<script>
import AgoraRTM from 'agora-rtm-sdk';
import {RtmTokenBuilder, RtmRole} from 'agora-access-token';

export default {
  name: "msgtest",
  data() {
    return {
      appId: "",
      appCertificate: "",
      clientID: "",
      channel: "",
      userList: [],
      options: {
        uid: "",
        token: "",
      },
    }
  },
  created() {
    this.appId = "e0137c98e86c47b58b38606d42109aca";
    this.appCertificate = "0899f451a3b048dcb073db0f2f7c3f37";

    this.clientID = AgoraRTM.createInstance(this.appId);
    console.log("1. clientId: ", this.clientId);
    const self = this;

    this.clientID.on('MessageFromPeer', function (message, peerId) {
      document.getElementById("log").appendChild(document.createElement('div')).append("Message from: " + peerId + " Message: " + message.text)
      document.getElementById("log").scrollTop = document.getElementById("log").scrollHeight;
    });

// Display connection state changes
    this.clientID.on('ConnectionStateChanged', function (state, reason) {
      document.getElementById("log").appendChild(document.createElement('div')).append("State changed To: " + state + " Reason: " + reason)
    });

    this.channel = this.clientID.createChannel("demoChannel");

    // 메시지 받기 (type: text, image)
    this.channel.on('ChannelMessage', async function (message, memberId) {
      if (message.messageType == 'TEXT') {
        const posX = message.text.split(',')[0];
        const posY = message.text.split(',')[1];
        const eventForm = document.getElementById("event");
        const memberCursor = document.getElementById(`cursor-${memberId}`);
        memberCursor.style.left = posX+"px";
        memberCursor.style.top = `${posY}px`;
        console.log(eventForm);
        console.log(memberCursor);
      } else {
        console.log('Other type');
      }
      document.getElementById("log").scrollTop = document.getElementById("log").scrollHeight;
    })
// Display channel member stats
    this.channel.on('MemberJoined', function (memberId) {
      document.getElementById("log").appendChild(document.createElement('div')).append(memberId + " joined the channel")
      document.getElementById("log").scrollTop = document.getElementById("log").scrollHeight;
      self.userList.push(memberId);

      // create join member cursor
      self.createCursor(memberId);
    })
// Display channel member stats
    this.channel.on('MemberLeft', function (memberId) {
      document.getElementById("log").appendChild(document.createElement('div')).append(memberId + " left the channel")
      document.getElementById("log").scrollTop = document.getElementById("log").scrollHeight;
      self.userList = self.userList.filter((member) => member != memberId);

      // delete cursor
      const eventForm = document.getElementById("event");
      const memberCursor = document.getElementById(`cursor-${memberId}`);
      eventForm.removeChild(memberCursor);
    })
  },
  mounted() {
    this.channel.getMembers().then((memberList) => {
      this.userList = memberList;
    });
  },
  methods: {
    createCursor(memberId){
      // create join member cursor
      const eventForm = document.getElementById("event");
      const memberCursor = document.createElement("div");
      memberCursor.classList.add("cursor");
      memberCursor.id = "cursor-"+memberId;
      eventForm.append(memberCursor);
      // set cursor to random background color and size;
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      const bgColor = "rgb(" + r + "," + g + "," + b + ")";
      memberCursor.style.background = bgColor;
      memberCursor.style.border = "solid 1px black";
      memberCursor.style.width = "10px";
      memberCursor.style.height = "10px";
      memberCursor.style.position = "absolute";
      memberCursor.style.left = "0px";
      memberCursor.style.top = "0px";
    },
    async mousePosition(e) {
      if (this.options.token == "") return;
      const posX = e.offsetX;
      const posY = e.offsetY;
      const channelMessage = `${posX},${posY}`

      if (this.channel != null) {
        await this.channel.sendMessage({text: channelMessage})
      } else console.log('Channel is empty');
    },
    async loginUser() {
      this.options.uid = document.getElementById("userID").value.toString();
      this.options.token = this.tokenGenerate(this.options.uid);
      console.log('RTM Tokens : ' + this.options.token);
      await this.clientID.login(this.options).catch(function (err) {
        console.log('AgoraRTM client login failure!!!');
      });
      await this.channel.join().then(() => {
        document.getElementById("log").appendChild(document.createElement('div'))
          .append("You have successfully joined channel " + this.channel.channelId)
      }).catch(function (err) {
        console.log('AgoraRTM channel join failure!!!');
      });
      this.channel.getMembers().then((memberList) => {
        this.userList = memberList;
        // create cursor of earlier participant
        for(let i =0; i<this.userList.length; i++){
          if (this.userList[i] == this.options.uid) continue;
          this.createCursor(this.userList[i]);
        }
      });
    },
    async logoutUser() {
      if (this.channel != null) {
        await this.channel.leave().catch(function (err) {
          console.log('Channel leaving failed!');
        });
        this.userList = this.userList.filter((member) => member != this.options.uid);
      } else {
        console.log("Channel is empty");
      }
      await this.clientID.logout().catch(function (err) {
        console.log('AgoraRTM client logout failure!!!');
      });
    },
    tokenGenerate(account) {
      const expirationTimeInSeconds = 7200;
      const currentTimestamp = Math.floor(Date.now() / 1000);
      const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;
      const token = RtmTokenBuilder.buildToken(this.appId, this.appCertificate, account, RtmRole, privilegeExpiredTs);
      return token;
    },
  }
}
</script>

<style scoped>
.text-field{
  display:inline-block;
  width:200px;
  border: none 0px;
  border-bottom: #95999c solid 1px;
}

#login-form{
  margin: 20px 0 20px 0;
  padding-left:5px;
}

#member-form{
  border: #95999c solid 1px;
  border-radius: 10px;
  width: 700px;
  padding: 10px;
}

#log-form{
  border: #95999c solid 1px;
  border-radius: 10px;
  width: 700px;
  height: 120px;
  padding: 10px;
}

#log{
  border:none;
  width:680px;
  height:60px;
  overflow: auto;
  flex-direction: column;
}

ul, li {
  display:inline;
}

#event-form{
  border: #95999c solid 1px;
  border-radius: 10px;
  width: 700px;
  height: 300px;
  background-color: #95999c;
}

#event-form div{
  border: #95999c solid 1px;
  border-radius: 10px;
  width: 700px;
  height: 300px;
  background-color: #95999c;
  position: absolute;
}

.cursor{
  width:10px;
  height:10px;
  background-color: white;
  border: solid 1px black;
}
</style>
