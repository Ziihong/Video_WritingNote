<template>
  <div>
    <div class='informBox'>
      <v-row>
        <div style="margin: 10px">
          <v-btn color="primary" id="login" @click="loginUser"
          >LOGIN</v-btn>
          <v-btn type="button" id="logout" @click="logoutUser"
          >LOGOUT</v-btn>
        </div>
      </v-row>
<!--      <div class="inputToAccess">-->
<!--        <div class="agora-text">Appid</div>-->
<!--        <input v-model="option.appid" class="inputBox" placeholder="Appid">-->
<!--      </div>-->
<!--      <div class="inputToAccess">-->
<!--        <div class="agora-text">Token</div>-->
<!--        <input v-model="option.token" class="inputBox" placeholder="Token">-->
<!--      </div>-->
<!--      <div class="inputToAccess">-->
<!--        <div class="agora-text">Channel Name</div>-->
<!--        <input v-model="option.channel" class="inputBox" placeholder="Channel Name">-->
<!--      </div>-->
<!--      <div class="agora-button">-->
<!--        <v-btn type="primary" @click="joinEvent">join</v-btn>-->
<!--        <v-btn type="primary" @click='leaveEvent'>leave</v-btn>-->
<!--      </div>-->
<!--      <div class="input-field" style="margin: 10px">-->
<!--        <label>User ID</label>-->
<!--        <input type="text" placeholder="User ID" id="userID">-->
<!--      </div>-->
<!--      <v-row>-->
<!--        <div style="margin: 10px">-->
<!--          <v-btn color="primary" id="login" @click="loginUser()"-->
<!--          >LOGIN</v-btn>-->
<!--          <v-btn type="button" id="logout" @click="logoutUser"-->
<!--          >LOGOUT</v-btn>-->
<!--        </div>-->
<!--      </v-row>-->
      <div class="agora-button">
        <v-btn v-if="!onVideo" type="primary" @click="videoCallJoin"><v-icon left>mdi-video</v-icon></v-btn>
        <v-btn v-else @click='leaveChannel'><v-icon>mdi-video-off</v-icon></v-btn>
        <v-btn v-if="!onVoice" type="primary" @click="voiceCallJoin"><v-icon left>mdi-phone</v-icon></v-btn>
        <v-btn v-else @click='leaveChannel'><v-icon>mdi-phone-off</v-icon></v-btn>
      </div>
    </div>
<!--    <template v-for="(member) of userList">-->
<!--      <li>{{member}}</li>-->
<!--    </template>-->
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
import RTCClient from "../static/agora-rtc-client";
import StreamPlayer from "../components/StreamPlayer";
import AgoraRTC from "agora-rtc-sdk";
import {RtcRole, RtcTokenBuilder} from "agora-access-token";
import {mapGetters, mapState} from "vuex";

export default {
  components: {
    StreamPlayer
  },
  computed: {
    ...mapState({
      authUser: state => state.authUser,
    }),
    ...mapGetters({
      isLoggedIn: 'isLoggedIn',
    }),
  },
  data () {
    return {
      option: {
        appid: '',
        token: '',
        uid: '',
        channel: '',
      },
      disableJoin: false,
      localStream: null,
      remoteStreams: [],
      // client: null,
      // stream: null,
      // clientId: "",
      // channel: "",
      // appId: "",
      appCertificate: "",
      // userList: [],
      onVideo: false,
      onVoice: false,
    }
  },
  created() {
    // const self = this;
    this.option.appid = "e68902b5adbf4686abbf25626ba75b91";
    this.appCertificate = "8789fcbdc5514adbb59cbc42f17ee7fb";
    // this.option.token = "006e68902b5adbf4686abbf25626ba75b91IABYyWcOrUGRkRCHRGucbXQxIlSy3JJl4pbyIRvUj0GJWAx+f9gAAAAAEAB8iSkWcW36YAEAAQBwbfpg"
    // this.clientID = AgoraRTC.createInstance(this.option.appid);
    // this.clientID.createChannel("demoChannel");
    this.option.channel = "test";
    // this.channel.on('MemberJoined', function (memberId) {
    //   self.userList.push(memberId);
    // })
    // this.channel.on('MemberLeft', function (memberId) {
    //   self.userList = self.userList.filter((member)=>member!=memberId);
    // })
    this.rtc = new RTCClient()
    let rtc = this.rtc
    rtc.on('stream-added', (event) => {
      let {stream} = event
      rtc.client.subscribe(stream)
    })

    rtc.on('stream-subscribed', (event) => {
      let {stream} = event
      if (!this.remoteStreams.find((it) => it.getId() === stream.getId())) {
        this.remoteStreams.push(stream)
      }
    })

    rtc.on('stream-removed', (event) => {
      let {stream} = event
      this.remoteStreams = this.remoteStreams.filter((it) => it.getId() !== stream.getId())
    })
    rtc.on('peer-online', (event) => {
      // alert(`Peer ${event.uid} is online`);
    })
    rtc.on('peer-leave', (event) => {
      // alert(`Peer ${event.uid} already leave`);
      this.remoteStreams = this.remoteStreams.filter((it) => it.getId() !== event.uid)
    })
  },
  // mounted() {
  //   this.channel.getMembers().then((memberList)=>{
  //     this.userList = memberList;
  //   });
  // },
  methods: {
    videoCallJoin() {
      this.rtc.joinChannel(this.option).then(() => {
        alert("Join Success");

        this.rtc.publishVideoCall().then((stream) => {
          alert("Publish Success");
          this.localStream = stream
          this.onVideo = true;
        }).catch((e) => {
          alert("Publish Failure");
          console.log(e)
        })
      }).catch((err) => {
        alert("Join Failure");
      })
      this.disableJoin = true
    },
    voiceCallJoin() {
      this.rtc.joinChannel(this.option).then(() => {
        alert("Join Success");

        this.rtc.publishVoiceCall().then((stream) => {
          alert("Publish Success");
          this.localStream = stream
          this.onVoice = true;
        }).catch((e) => {
          alert("Publish Failure");
          console.log(e)
        })
      }).catch((err) => {
        alert("Join Failure");
      })
      this.disableJoin = true
    },
    leaveChannel() {
      this.disableJoin = false
      this.rtc.leaveChannel().then(() => {
        alert("Leave Success");
      }).catch((e) => {
        alert("Leave Failure");
      })
      this.localStream = null
      this.remoteStreams = []
      this.onVideo = false;
      this.onVoice = false;
    },
    tokenGenerate(){
      this.option.uid = Math.floor(Math.random() * 100000);
      const expirationTimeInSeconds = 7200;
      const currentTimestamp = Math.floor(Date.now() / 1000);
      const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;
      const token = RtcTokenBuilder.buildTokenWithUid(this.option.appid, this.appCertificate, this.option.channel, this.option.uid, RtcRole.PUBLISHER, privilegeExpiredTs);
      return token;
    },
    async loginUser(){
      // this.option.uid = document.getElementById("userID").value.toString();
      this.option.token = this.tokenGenerate();
      alert("Success agora logIn");
      // console.log('RTM Tokens : '+this.option.token);
      // await this.clientID.login(this.option).catch(function (err){
      //   console.log('AgoraRTM client login failure!!!');
      // });
    },
    async logoutUser(){
      alert("Success agora logOut");
      // await this.clientID.logout().catch(function (err){
      //   console.log('AgoraRTM client logout failure!!!');
      // });
    },
    // async joinChannel(){
    //   await this.channel.join().then(()=>{
    //     alert("Join Success");
    //   }).catch(function (err){
    //     alert("Join Failure");
    //   });
    //   this.channel.getMembers().then((memberList)=>{
    //     this.userList = memberList;
    //   });
    //
    // },
    // async leaveChannel(){
    //   if (this.channel != null) {
    //     await this.channel.leave().catch(function (err){
    //       alert("Leave Failure");
    //       console.log('Channel leaving failed!');
    //     });
    //     alert("Leave Success");
    //     this.disableJoin = false
    //     this.localStream = null;
    //     this.remoteStreams = [];
    //     this.userList = this.userList.filter((member)=>member!=this.option.uid);
    //     this.onVideo = false;
    //     this.onVoice = false;
    //   }
    //   else
    //   {
    //     console.log("Channel is empty");
    //   }
    // },
    // publishVideoCall() {
    //   return new Promise((resolve) => {
    //     // Create a videoStream
    //     this.stream = AgoraRTC.createStream({
    //       streamID: this.option.uid,
    //       audio: true,
    //       video: true,
    //       screen: false,
    //     })
    //     // Initialize the stream
    //     this.stream.init(() => {
    //       console.log("init local stream success")
    //       resolve(this.stream)
    //       // Publish the local stream
    //       this.client.publish(this.stream, (err) =>  {
    //         console.log("publish failed")
    //         console.error(err)
    //       })
    //     })
    //   })
    // },
    // publishVoiceCall() {
    //   return new Promise((resolve) => {
    //     // Create a voiceStream
    //     this.stream = AgoraRTC.createStream({
    //       streamID: this.option.uid,
    //       audio: true,
    //       video: false,
    //       screen: false
    //     })
    //     // Initialize the stream
    //     this.stream.init(() => {
    //       console.log("init local stream success")
    //       resolve(this.stream)
    //       // Publish the local stream
    //       this.client.publish(this.stream, (err) =>  {
    //         console.log("publish failed")
    //         console.error(err)
    //       })
    //     })
    //   })
    // },
    // videoCallJoin () {
    //   this.joinChannel().then(() => {
    //     this.publishVideoCall().then((stream) => {
    //       alert("Publish Success");
    //       this.localStream = stream
    //       this.onVideo = true;
    //     }).catch((e) => {
    //       alert("Publish Failure");
    //       console.log(e)
    //     })
    //   }).catch((err) => {
    //     alert("Join Failure");
    //   })
    //   this.disableJoin = true
    // },
    // voiceCallJoin (){
    //   this.joinChannel().then(() => {
    //     this.publishVoiceCall().then((stream) => {
    //       alert("Publish Success");
    //       this.localStream = stream
    //       this.onVoice = true;
    //     }).catch((e) => {
    //       alert("Publish Failure");
    //       console.log(e)
    //     })
    //   }).catch((err) => {
    //     alert("Join Failure");
    //   })
    //   this.disableJoin = true
    // },
    // tokenGenerate(account){
    //   const expirationTimeInSeconds = 7200;
    //   const currentTimestamp = Math.floor(Date.now() / 1000);
    //   const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;
    //   const token = RtmTokenBuilder.buildToken(this.appId, this.appCertificate, account, RtmRole, privilegeExpiredTs);
    //   return token;
    // },
  }
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

