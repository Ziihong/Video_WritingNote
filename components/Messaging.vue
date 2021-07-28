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
<!--      <div class="input-field" style="margin: 10px">-->
<!--        <label>Peer Id</label>-->
<!--        <input type="text" placeholder="peer id" id="peerId">-->
<!--      </div>-->
<!--      <div class="input-field channel-padding">-->
<!--        <label>Peer Message</label>-->
<!--        <input type="text" placeholder="peer message" id="peerMessage">-->
<!--        <v-btn type="button" id="send_peer_message"-->
<!--               @click="sendPeerMsg"-->
<!--        >SEND</v-btn>-->
<!--      </div>-->
    </form>
    <v-row style="margin: 10px">
      <div id="log"></div>
    </v-row>
    <v-row>
      <v-row>
        <div class="input-field channel-padding">
          <label>Channel Message</label>
          <input type="text" placeholder="channel message" id="channelMessage"
                 @keydown="handleInputSend">
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
  </v-row>
</template>

<script>
import AgoraRTM from 'agora-rtm-sdk';
import {RtmTokenBuilder,RtmRole} from 'agora-access-token';

export default {
  name: "Messaging",
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
      }
    }
  },
  created() {
    this.appId = "e0137c98e86c47b58b38606d42109aca";
    this.appCertificate = "0899f451a3b048dcb073db0f2f7c3f37";
    this.clientID = AgoraRTM.createInstance(this.appId);
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
    this.channel.on('ChannelMessage', async function (message, memberId) {
      if(message.messageType=='TEXT') {
        const receiveMessage = document.createElement('div');
        const receiver = document.createElement('div');
        const receiveText = document.createElement('div');
        const receiveTime = document.createElement('time');
        let timeString = self.makeTimeString();
        receiver.classList.add('sender_name');
        receiver.append(memberId);
        receiveText.append(message.text);
        receiveText.classList.add('receiver_block');
        receiveTime.append(timeString);
        receiveTime.classList.add('receiver_time');
        receiveMessage.append(receiver);
        receiveMessage.append(receiveText);
        receiveMessage.append(receiveTime);
        document.getElementById("log").appendChild(receiveMessage);
      }
      else if(message.messageType=='IMAGE'){
        console.log(message);
        const receiveMessage = document.createElement('div');
        const receiver = document.createElement('div');
        const receiveBlock = document.createElement('div');
        const receivedImage = document.createElement("img");
        const receiveTime = document.createElement('time');
        let timeString = self.makeTimeString();
        const blob = await self.clientID.downloadMedia(message.mediaId).catch(function (err){
          console.log("Media download failed!");
        });
        const url = window.URL.createObjectURL(blob);
        receivedImage.src = url;
        receivedImage.style.maxWidth = '75%';
        console.log(receivedImage);
        receiveBlock.append(receivedImage);

        receiver.classList.add('sender_name');
        receiver.append(memberId);
        receiveBlock.classList.add('receiver_block');
        receiveTime.append(timeString);
        receiveTime.classList.add('receiver_time');
        receiveMessage.append(receiver);
        receiveMessage.append(receivedImage);
        receiveMessage.append(receiveTime);
        document.getElementById("log").appendChild(receiveMessage);
        receivedImage.onload = function () {
          window.URL.revokeObjectURL(url);
        }
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
    handleInputSend(e){
      if(e.keyCode == 13 && !e.shiftKey) {
        e.preventDefault();
        this.sendChannelMsg();
      }
    },
    async sendChannelMsg(){
      let channelMessage = document.getElementById("channelMessage").value.toString();

      if (this.channel != null) {
        const sendMessage = document.createElement('div');
        const sender = document.createElement('div');
        const sendText = document.createElement('div');
        const sendTime = document.createElement('time');
        let timeString = this.makeTimeString();
        sender.append(this.options.uid);
        sender.classList.add('sender_name');
        sendText.append(channelMessage);
        sendText.classList.add('sender_block');
        sendMessage.classList.add('sender_message');
        sendTime.append(timeString);
        sendTime.classList.add('sender_time');
        sendMessage.append(sender);
        sendMessage.append(sendTime);
        sendMessage.append(sendText);

        await this.channel.sendMessage({text: channelMessage}).then(() => {
          document.getElementById("log").appendChild(sendMessage);
          // appendChild(document.createElement('div')).
          // append("Channel message "+this.options.uid+": " + channelMessage + " from " + this.channel.channelId);
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
          width: fileBlob.width,
          height: fileBlob.height,
          thumbnailWidth: 50,
          thumbnailHeight: 200,
        }).catch(function (err){
          console.log('Create by upload error! '+err);
        });
        console.log(mediaMessage.mediaId);
        // const imageMessage = await this.clientID.createMessage({
        //   mediaId: mediaMessage.mediaId,
        //   messageType: 'IMAGE',
        //   fileName: fileName,
        //   description: 'send image',
        //   thumbnail: undefined,
        //   width: 100,
        //   height: 200,
        //   thumbnailWidth: 50,
        //   thumbnailHeight: 200,
        // });
        this.channel.sendMessage(mediaMessage).then(()=>{
          console.log('Image Message send success');
          const sendMessage = document.createElement('div');
          const sender = document.createElement('div');
          const sendImage = document.createElement('img');
          const senderTime = document.createElement('time');
          let timeString = this.makeTimeString();
          const url = window.URL.createObjectURL(fileBlob);
          sendImage.src = url;
          sendImage.style.maxWidth = '75%';

          sender.classList.add('sender_name');
          sender.append(this.options.uid);
          senderTime.append(timeString);
          senderTime.classList.add('sender_time');
          sendMessage.classList.add('sender_message')
          sendMessage.append(sender);
          sendMessage.append(senderTime);
          sendMessage.append(sendImage);
          document.getElementById("log").appendChild(sendMessage);
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
    makeTimeString(){
      const now = new Date();
      let hour = now.getHours();
      let timeString = '';
      if(hour>=12){
        timeString = '오후 ';
      }
      else{
        timeString = '오전 ';
      }
      if(hour%12==0) hour=12;
      else hour=hour%12;
      timeString = timeString + hour +':'+String(now.getMinutes()).padStart(2,"0");
      return timeString;
    },
  }
}
</script>

<style>
.input-field{
  margin: 10px;
}
input{
  border: #222222 solid 1px;
  margin-left: 5px;
}
.sender_name{
  font-weight: bold;
}
.sender_block{
  max-width: 75%;
  background-color: yellow;
  padding: 10px;
  border-radius: 5px;
  display: inline-block;
  text-align: left;
  margin-right: 10px;
}
.sender_block::after {
  content: '';
  position: relative;
  border-right: 15px solid transparent;
  border-top: 15px solid yellow;
  top: 20px;
  right: -20px;
}
.sender_time{
  margin-right: 0.5em;
}
.sender_message{
  text-align: right;
  max-width: 100%;
  margin-bottom: 10px;
}
.receiver_block{
  max-width: 75%;
  background-color: white;
  padding: 10px;
  border-radius: 5px;
  display: inline-block;
}
.receiver_block::before{
  content: '';
  position: relative;
  border-left: 15px solid transparent;
  border-top: 15px solid white;
  top: 20px;
  left: -20px;
}
.receiver_time{
  margin-left: 0.5em;
}
.receive_message{
  text-align: left;
  max-width: 100%;
  margin-bottom: 10px;
}
#log{
  border: #222222 solid 1px;
  overflow : auto;
  height: 65vh;
  padding: 10px;
  display: flex;
  flex-direction: column;
}
</style>
