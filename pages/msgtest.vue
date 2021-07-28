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

    <v-form>
      <div id="log"></div>
    </v-form>

    <v-form id="msg-form">
      <input class="text-field-msg" type="text" placeholder="Channel message" id="channelMessage"/>
      <v-btn color="primary" type="button" id="send_channel_message" @click="sendChannelMsg">SEND</v-btn>
      <v-btn><v-file-input type="file" id="file_message" placeholder="image"/></v-btn>
      <v-btn color="primary" id="send_channel_file" @click="sendChannelFileMsg">SEND</v-btn>
    </v-form>

    <v-form id="peer-form">
      <input class="text-field" type="text" placeholder="Peer ID" id="peerId"/>
      <input class="text-field-msg" type="text" placeholder="Peer message" id="peerMessage"/>
      <v-btn color="primary" type="button" id="send_peer_message" @click="sendPeerMsg">SEND</v-btn>
    </v-form>
  </v-container>
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
        document.getElementById("log").appendChild(document.createElement('div')).append("Message received from: " + memberId + " Message: " + message.text);
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
      // login
      this.options.uid = document.getElementById("userID").value.toString();
      this.options.token = this.tokenGenerate(this.options.uid);
      console.log('RTM Tokens : '+this.options.token);
      await this.clientID.login(this.options).catch(function (err){
        console.log('AgoraRTM client login failure!!!');
      });

      // join
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
    async logoutUser(){
      await this.clientID.logout().catch(function (err){
        console.log('AgoraRTM client logout failure!!!');
      });
    },
    // async joinChannel(){
    //   await this.channel.join().then(()=>{
    //     document.getElementById("log").appendChild(document.createElement('div'))
    //       .append("You have successfully joined channel " + this.channel.channelId)
    //   }).catch(function (err){
    //     console.log('AgoraRTM channel join failure!!!');
    //   });
    //   this.channel.getMembers().then((memberList)=>{
    //     this.userList = memberList;
    //   });
    // },
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
          // console.log("msg:", messageInput);
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
.text-field{
  display:inline-block;
  width:200px;
  border-bottom: #95999c solid 1px;
}

.text-field-msg{
  display:inline-block;
  width:360px;
  border-bottom: #95999c solid 1px;
}

#login-form{
  margin: 20px 0 20px 0;
  padding-left:5px;
}

#log{
  border: #95999c solid 1px;
  border-radius: 10px;
  overflow: auto;
  width: 700px;
  height: 200px;
  padding: 10px;
  display: flex;
  flex-direction: column;
}

#msg-form, #peer-form, #member-form{
  border: #95999c solid 1px;
  border-radius: 10px;
  width: 700px;
  padding: 10px;
}

ul, li {
  display:inline;
}

/*#form-container{*/
/*  background-color: #2a629c;*/
/*}*/

/*#channel-name{*/
/*  background-color: #86cfda;*/
/*}*/

/*#login-form{*/
/*  background-color: #721c24;*/
/*}*/

/*#peer-form{*/
/*  background-color: #e0a800;*/
/*}*/

</style>
