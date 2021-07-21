<template>
  <div>
    <div class='informBox'>
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
      <div class="agora-button">
        <v-btn type="primary" @click="joinEvent">join</v-btn>
        <v-btn type="primary" @click='leaveEvent'>leave</v-btn>
      </div>
    </div>
    <div class="agora-view">
      <div class="showVideo">
        <StreamPlayer :stream="localStream" :domId="localStream.getId()" v-if="localStream"></StreamPlayer>
      </div>
      <div class="showVideo" :key="index" v-for="(remoteStream, index) in remoteStreams">
        <StreamPlayer :stream="remoteStream" :domId="remoteStream.getId()"></StreamPlayer>
      </div>
    </div>
  </div>
</template>

<script>
import StreamPlayer from "../components/StreamPlayer";
import AgoraRTC from "agora-rtc-sdk";
import {RtmRole, RtmTokenBuilder} from "agora-access-token";
import AgoraRTM from "agora-rtm-sdk";

export default {
  components: {
    StreamPlayer
  },
  data () {
    return {
      option: {
        appid: '',
        token: '',
        uid: null,
        channel: '',
      },
      disableJoin: false,
      localStream: null,
      remoteStreams: [],
      client: null,
      stream: null,
      clientId: "",
      channel: "",
      appId: "",
      appCertificate: "",
    }
  },
  created() {
    this.appId = "e68902b5adbf4686abbf25626ba75b91";
    this.appCertificate = "8789fcbdc5514adbb59cbc42f17ee7fb";
    this.clientID = AgoraRTM.createInstance(this.appId);
    this.channel = this.clientID.createChannel("demoChannel");
  },
  methods: {
    async loginUser(){
      this.option.uid = document.getElementById("userID").value.toString();
      this.option.token = this.tokenGenerate(this.option.uid);
      console.log('RTM Tokens : '+this.option.token);
      await this.clientID.login(this.option).catch(function (err){
        console.log('AgoraRTM client login failure!!!');
      });
    },
    async logoutUser(){
      await this.clientID.logout().catch(function (err){
        console.log('AgoraRTM client logout failure!!!');
      });
    },
    joinEvent () {
      this.joinChannel(this.option).then(() => {
        alert("Join Success");

        this.publishStream().then((stream) => {
          alert("Publish Success");
          this.localStream = stream
        }).catch((e) => {
          alert("Publish Failure");
          console.log(e)
        })
      }).catch((err) => {
        alert("Join Failure");
      })
      this.disableJoin = true
    },
    leaveEvent () {
      this.disableJoin = false
      this.leaveChannel().then(() => {
        alert("Leave Success");
      }).catch((e) => {
        alert("Leave Failure");
      })
      this.localStream = null
      this.remoteStreams = []
    },
    judge(detail) {
      alert(`Please enter the ${detail}`);
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
    publishStream() {
      return new Promise((resolve, reject) => {
        // Create a local stream
        this.stream = AgoraRTC.createStream({
          streamID: this.option.uid,
          audio: true,
          video: true,
          screen: false,
        })
        // Initialize the local stream
        this.stream.init(() => {
          console.log("init local stream success")
          resolve(this.stream)
          // Publish the local stream
          this.client.publish(this.stream, (err) =>  {
            console.log("publish failed")
            console.error(err)
          })
        })
      })
    },
    publishVoiceStream() {
      return new Promise((resolve, reject) => {
        // Create a local stream
        this.stream = AgoraRTC.createStream({
          streamID: this.option.uid,
          audio: true,
          video: false,
          screen: false
        })
        // Initialize the local stream
        this.stream.init(() => {
          console.log("init local stream success")
          resolve(this.stream)
          // Publish the local stream
          this.client.publish(this.stream, (err) =>  {
            console.log("publish failed")
            console.error(err)
          })
        })
      })
    },
    tokenGenerate(account){
      const expirationTimeInSeconds = 7200;
      const currentTimestamp = Math.floor(Date.now() / 1000);
      const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;
      const token = RtmTokenBuilder.buildToken(this.appId, this.appCertificate, account, RtmRole, privilegeExpiredTs);
      return token;
    },
  },
}
</script>

<style scoped>
.agora-view {
  display: flex;
  flex-wrap: wrap;
}
.inputToAccess {
  margin: 20px;
  width: 320px;
}
.agora-text {
  margin: 5px;
  font-size: 16px;
  font-weight: bold;
}
.inputBox {
  border: 1px solid;
}
.agora-button {
  display: flex;
  width: 160px;
  justify-content: space-between;
  margin: 20px;
}
.showVideo {
  width: 320px;
  height: 240px;
}
</style>

