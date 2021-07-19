<template>
  <v-row>
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
      <div class="input-field channel-padding">
        <label>Channel Message</label>
        <input type="text" placeholder="channel message" id="channelMessage">
        <v-btn type="button" id="send_channel_message"
               @click="sendChannelMsg"
        >SEND</v-btn>
      </div>
      <v-row>
        <input type="file" id="file_message">
        <v-btn color="primary" id="send_channel_file"
               @click="sendChannelFileMsg"
        >SEND</v-btn>
      </v-row>
      <div class="input-field">
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
      options: {
        uid: "",
        token: "",
      }
    }
  },
  created() {
    this.appId = "e0137c98e86c47b58b38606d42109aca";
    this.appCertificate = "0899f451a3b048dcb073db0f2f7c3f37";
    this.clientID = AgoraRTM.createInstance(this.appId);
    this.clientID.on('MessageFromPeer', function (message, peerId) {
      document.getElementById("log").appendChild(document.createElement('div')).append("Message from: " + peerId + " Message: " + message.text)
    });
// Display connection state changes
    this.clientID.on('ConnectionStateChanged', function (state, reason) {
      document.getElementById("log").appendChild(document.createElement('div')).append("State changed To: " + state + " Reason: " + reason)
    });
    this.channel = this.clientID.createChannel("demoChannel");
    this.channel.on('ChannelMessage', async function (message, memberId) {
      if(message.messageType=='TEXT') {
        document.getElementById("log").appendChild(document.createElement('div')).append("Message received from: " + memberId + " Message: " + message.text);
      }
      else if(message.messageType=='IMAGE'){
        console.log(message);
        const blob = await this.clientID.downloadMedia(message.mediaId).catch(function (err){
          console.log("Media download failed!");
        });
        document.getElementById("log").appendChild(document.createElement('div')).append("Image received from: " + memberId + " Message: " + message.fileName);
        console.log(blob);
      }
      else{
        console.log('Other type');
      }
    })
// Display channel member stats
    this.channel.on('MemberJoined', function (memberId) {
      document.getElementById("log").appendChild(document.createElement('div')).append(memberId + " joined the channel")
    })
// Display channel member stats
    this.channel.on('MemberLeft', function (memberId) {
      document.getElementById("log").appendChild(document.createElement('div')).append(memberId + " left the channel")
    })
  },
  methods: {
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
        console.log(memberList);
      });

    },
    async leaveChannel(){
      if (this.channel != null) {
        await this.channel.leave().catch(function (err){
          console.log('Channel leaving failed!');
        });
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
        console.log(imageMessage);
        this.channel.sendMessage(mediaMessage).then(()=>{
          console.log('Image Message send success');
          document.getElementById("log").appendChild(document.createElement('div')).
          append("Channel message "+this.options.uid+": " + mediaMessage.fileName + " from " + this.channel.channelId);
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
      });
    },
    tokenGenerate(account){
      const expirationTimeInSeconds = 3600;
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
</style>
