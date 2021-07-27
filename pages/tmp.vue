<template>

  <v-row style="padding: 20px">
    <form id="loginForm">
      <div class="input-field" style="margin: 10px">
        <label>User ID</label>
        <input type="text" placeholder="User ID" id="userID">
      </div>
      <v-row>
        <div style="margin: 10px">
          <v-btn color="primary" id="login" @click="loginUser"
          >LOGIN</v-btn>
          <v-btn type="button" id="logout" @click="logoutUser"
          >LOGOUT</v-btn>
        </div>
      </v-row>
      <div class="input-field">
        <label>Channel name: demoChannel</label>
      </div>
      <v-row>
        <div>
          <v-btn color="primary" id="join" @click="joinChannel"
          >JOIN</v-btn>
          <v-btn type="button" id="leave" @click="leaveChannel">LEAVE</v-btn>
        </div>
      </v-row>
      <div class="input-field" style="margin: 10px">
        <label>Peer Id</label>
        <input type="text" placeholder="peer id" id="peerId">
      </div>
      <div class="input-field channel-padding">
        <label>Peer Message</label>
        <input type="text" placeholder="peer message" id="peerMessage">
        <v-btn type="button" id="send_peer_message"
               @click="sendPeerMsg"
        >SEND</v-btn>
      </div>
    </form>
    <v-row style="margin: 10px">
      <div id="log"></div>
    </v-row>
    <v-row>
      <v-row>
        <div class="input-field channel-padding">
          <label>Channel Message</label>
          <input type="text" placeholder="channel message" id="channelMessage">
          <v-btn type="button" id="send_channel_message"
                 @click="sendChannelMsg"
          >SEND</v-btn>
        </div>
      </v-row>
      <v-row>
        <v-btn>
          <v-file-input type="file" id="file_message"/>
        </v-btn>
        <v-btn color="primary" id="send_channel_file"
               @click="sendChannelFileMsg"
        >SEND</v-btn>
      </v-row>
    </v-row>
    <template v-for="(member) of userList">
      <li>{{member}}</li>
    </template>
    <v-row>
      <div id="mouse" @mousemove="mousePosition"><div id="cursor"></div></div>
    </v-row>
  </v-row>
</template>

<script>
import AgoraRTM from 'agora-rtm-sdk';
import {RtmTokenBuilder,RtmRole} from 'agora-access-token';

export default {
  name: "msgtest",
  data() {
    return{
      appId: "",
      appCertificate: "",
      clientID: "",
      channel: "",
      userList: [],
      options: {
        uid: "",
        token: "",
      },
      pos:{
        x:"",
        y:"",
      }
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
      if(message.messageType=='TEXT') {
        document.getElementById("log").appendChild(document.createElement('div')).append("Message received from: " + memberId + " Message: " + message.text);
        const posX = message.text.split(',')[0];
        const posY = message.text.split(',')[1];
        // document.getElementById("mouse").appendChild(document.createElement('div')).append(posX, posY);
        const cursor = document.getElementById("cursor");
        cursor.style.left = `${posX}px`;
        cursor.style.top = `${posY}px`;
      }
      else if(message.messageType=='IMAGE'){
        console.log(message);
        const receivedImage = document.createElement("img");
        const reader = new FileReader();
        document.getElementById("log").appendChild(document.createElement('div')).append("Image received from: " + memberId + " Message: " + message.fileName);
        const blob = await self.clientID.downloadMedia(message.mediaId).catch(function (err){
          console.log("Media download failed!");
        });
        const url = window.URL.createObjectURL(blob);
        receivedImage.src = url;
        receivedImage.width = message.width;
        receivedImage.height = message.height;
        document.getElementById("log").appendChild(receivedImage);
      }
      else{
        console.log('Other type');
      }
      document.getElementById("log").scrollTop = document.getElementById("log").scrollHeight;
    })
// Display channel member stats
    this.channel.on('MemberJoined', function (memberId) {
      document.getElementById("log").appendChild(document.createElement('div')).append(memberId + " joined the channel")
      document.getElementById("log").scrollTop = document.getElementById("log").scrollHeight;
      self.userList.push(memberId);
    })
// Display channel member stats
    this.channel.on('MemberLeft', function (memberId) {
      document.getElementById("log").appendChild(document.createElement('div')).append(memberId + " left the channel")
      document.getElementById("log").scrollTop = document.getElementById("log").scrollHeight;
      self.userList = self.userList.filter((member)=>member!=memberId);
    })
  },
  mounted() {
    this.channel.getMembers().then((memberList)=>{
      this.userList = memberList;
    });
  },
  methods: {
    async mousePosition(e){
      const dom = document.getElementById("mouse");
      this.pos.x = e.screenX;
      this.pos.y = e.screenY;
      const channelMessage = `${this.pos.x},${this.pos.y}`


      const cursor = document.getElementById("cursor");

      if (this.channel != null) {
        await this.channel.sendMessage({text:channelMessage}).then(() => {
          cursor.style.left = `${this.pos.x}px`;
          cursor.style.top = `${this.pos.y}px`;
        });
      }
      else console.log('Channel is empty');
    },
    async loginUser(){
      this.options.uid = document.getElementById("userID").value.toString();
      this.options.token = this.tokenGenerate(this.options.uid);
      console.log('RTM Tokens : '+this.options.token);
      await this.clientID.login(this.options).catch(function (err){
        console.log('AgoraRTM client login failure!!!');
      });
    },
    async logoutUser(){
      await this.clientID.logout().catch(function (err){
        console.log('AgoraRTM client logout failure!!!');
      });
    },
    async joinChannel(){
      await this.channel.join().then(()=>{
        document.getElementById("log").appendChild(document.createElement('div'))
          .append("You have successfully joined channel " + this.channel.channelId)
      }).catch(function (err){
        console.log('AgoraRTM channel join failure!!!');
      });
      this.channel.getMembers().then((memberList)=>{
        this.userList = memberList;
      });

    },
    async leaveChannel(){
      if (this.channel != null) {
        await this.channel.leave().catch(function (err){
          console.log('Channel leaving failed!');
        });
        this.userList = this.userList.filter((member)=>member!=this.options.uid);
      }
      else
      {
        console.log("Channel is empty");
      }
    },
    async sendChannelMsg(){
      let channelMessage = document.getElementById("channelMessage").value.toString();

      if (this.channel != null) {
        await this.channel.sendMessage({text: channelMessage}).then(() => {
          document.getElementById("log").appendChild(document.createElement('div')).
          append("Channel message "+this.options.uid+": " + channelMessage + " from " + this.channel.channelId);
          let messageInput = document.getElementById("channelMessage");
          messageInput.value = "";
          document.getElementById("log").scrollTop = document.getElementById("log").scrollHeight;
        });
      }
      else console.log('Channel is empty');
    },
    async sendChannelFileMsg(){
      let fileBlob = document.getElementById("file_message").files[0];
      let fileName = fileBlob.name;
      if (this.channel != null) {
        const mediaMessage = await this.clientID.createMediaMessageByUploading(fileBlob, {
          messageType: 'IMAGE',
          fileName: fileName,
          description: 'send image',
          thumbnail: undefined,
          width: 100,
          height: 200,
          thumbnailWidth: 50,
          thumbnailHeight: 200,
        }).catch(function (err){
          console.log('Create by upload error! '+err);
        });
        console.log(mediaMessage.mediaId);
        const imageMessage = await this.clientID.createMessage({
          mediaId: mediaMessage.mediaId,
          messageType: 'IMAGE',
          fileName: fileName,
          description: 'send image',
          thumbnail: undefined,
          width: 100,
          height: 200,
          thumbnailWidth: 50,
          thumbnailHeight: 200,
        });
        this.channel.sendMessage(mediaMessage).then(()=>{
          console.log('Image Message send success');
          document.getElementById("log").appendChild(document.createElement('div')).
          append("Channel message "+this.options.uid+": " + mediaMessage.fileName + " from " + this.channel.channelId);
          document.getElementById("log").scrollTop = document.getElementById("log").scrollHeight;
        }).catch(function (err){
          console.log('Image Message send error!');
        });
      }
      else console.log('Channel is empty');
    },
    async sendPeerMsg(){
      let peerId = document.getElementById("peerId").value.toString();
      let peerMessage = document.getElementById("peerMessage").value.toString();

      await this.clientID.sendMessageToPeer(
        { text: peerMessage },
        peerId,
      ).then(sendResult => {
        if (sendResult.hasPeerReceived) {
          document.getElementById("log").appendChild(document.createElement('div')).
          append("Message has been received by: " + peerId + " Message: " + peerMessage)
        } else {
          document.getElementById("log").appendChild(document.createElement('div'))
            .append("Message sent to: " + peerId + " Message: " + peerMessage)
        }
        document.getElementById("log").scrollTop = document.getElementById("log").scrollHeight;
      });
    },
    tokenGenerate(account){
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
.input-field{
  margin: 10px;
}
input{
  border: #222222 solid 1px;
  margin-left: 5px;
}
#log{
  border: #222222 solid 1px;
  overflow : auto;
  width: 700px;
  height: 200px;
  padding: 10px;
  display: flex;
  flex-direction: column;
}

#mouse{
  border: #222222 solid 1px;
  overflow : auto;
  width: 700px;
  height: 200px;
  margin-top:20px;
  padding: 10px;
  display: flex;
  flex-direction: column;
}

#cursor{
  position:absolute;
  top:0;
  left:0;
  width:5px;
  height:5px;
  background-color: #2a629c;
}
</style>
