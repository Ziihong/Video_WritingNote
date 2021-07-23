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
        </div>
      </v-row>
      <v-row>
        <div class="agora-button">
          <v-btn v-if="!onVideo" type="primary" @click="videoCallJoin"><v-icon left>mdi-video</v-icon></v-btn>
          <v-btn v-else @click='leaveCall'><v-icon>mdi-video-off</v-icon></v-btn>
          <v-btn v-if="!onVoice" type="primary" @click="voiceCallJoin"><v-icon left>mdi-phone</v-icon></v-btn>
          <v-btn v-else @click='leaveCall'><v-icon>mdi-phone-off</v-icon></v-btn>
        </div>
      </v-row>
    </div>
    <template v-for="(member) of userList">
      <li>{{member}}</li>
    </template>
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
        appid: "",
        token: "",
        channel: "",
        uid: "",
      },
      disableJoin: false,
      localStream: "",
      remoteStreams: [],
      userList: [],
      appCertificate: "",
      onVideo: false,
      onVoice: false,
    }
  },
  created() {
    this.option.appid = "e68902b5adbf4686abbf25626ba75b91";
    this.appCertificate = "8789fcbdc5514adbb59cbc42f17ee7fb";
    this.option.channel = "test";
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
      this.userList.push((event.uid));
    })
    rtc.on('peer-leave', (event) => {
      this.userList = this.userList.filter((it)=>it !== event.uid);
      this.remoteStreams = this.remoteStreams.filter((it) => it.getId() !== event.uid);
    })
  },
  methods: {
    videoCallJoin() {
      this.rtc.joinChannel(this.option).then(() => {
        this.rtc.publishVideoCall().then((stream) => {
          alert("Joined video call");
          this.localStream = stream;
          this.onVideo = true;
        }).catch((err) => {
          console.log("Publish Failure" + err);
        })
      }).catch((err) => {
        console.log("Join Failure" + err);
      })
      this.disableJoin = true;
    },
    voiceCallJoin() {
      this.rtc.joinChannel(this.option).then(() => {
        this.rtc.publishVoiceCall().then((stream) => {
          alert("Joined voice call");
          this.localStream = stream;
          this.onVoice = true;
        }).catch((err) => {
          console.log("Publish Failure" + err);
        })
      }).catch((err) => {
        console.log("Join Failure" + err);
      })
      this.disableJoin = true;
    },
    leaveCall() {
      this.disableJoin = false;
      this.rtc.leaveChannel().then(() => {
        alert("Leave Success");
      }).catch((err) => {
        console.log("Leave Failure" + err)
      })
      this.localStream = null;
      this.remoteStreams = [];
      this.userList = [];
      this.onVideo = false;
      this.onVoice = false;
    },
    async loginUser(){
      this.option.token = this.tokenGenerate();
      alert("Success agora logIn");
    },
    tokenGenerate(){
      this.option.uid = document.getElementById("userID").value.toString();
      // this.option.uid = Math.floor(Math.random() * 100000);
      const expirationTimeInSeconds = 7200;
      const currentTimestamp = Math.floor(Date.now() / 1000);
      const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;
      const token = RtcTokenBuilder.buildTokenWithUid(this.option.appid, this.appCertificate, this.option.channel, this.option.uid, RtcRole.PUBLISHER, privilegeExpiredTs);
      return token;
    },
  }
}
</script>

<style scoped>
.agora-view {
  display: flex;
  flex-wrap: wrap;
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

