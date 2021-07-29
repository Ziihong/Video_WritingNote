<template>
  <div>
    <div>
      <label>User ID</label>
      <input type="text" placeholder="User ID" id="userId">
      <input type="text" placeholder="Channel" id="channelId">
      <v-btn v-if="!onVoice" color="primary" @click="voiceCallJoin"><v-icon left>mdi-phone</v-icon></v-btn>
      <v-btn v-else @click='leaveCall'><v-icon>mdi-phone-off</v-icon></v-btn>
      <v-btn v-if="!onScreen" color="primary" @click="startShareScreen"><v-icon left>mdi-monitor</v-icon></v-btn>
      <v-btn v-else @click='leaveCall'><v-icon>mdi-off</v-icon></v-btn>
    </div>
    <template v-for="(member) of userList">
      <li>{{member}}</li>
    </template>
    <div class="agora-view">
      <div class="show">
        <StreamPlayer :stream="localStream" :domId="localStream.getId()" v-if="localStream"></StreamPlayer>
      </div>
      <div class="show" :key="index" v-for="(remoteStream, index) in remoteStreams">
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
      onScreen: false,
      onVoice: false,
    }
  },
  created() {
    this.option.appid = "e68902b5adbf4686abbf25626ba75b91";
    this.appCertificate = "8789fcbdc5514adbb59cbc42f17ee7fb";
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
    voiceCallJoin() {
      this.option.token = this.tokenGenerate();
      this.rtc.joinChannel(this.option).then(() => {
        this.rtc.publishVoiceCall().then((stream) => {
          alert("Joined voice call");
          this.localStream = stream;
          this.onVoice = true;
          this.userList.push(this.option.uid);
        }).catch((err) => {
          console.log("Publish Failure" + err);
        })
      }).catch((err) => {
        console.log("Join Failure" + err);
      })
      this.disableJoin = true;
    },
    startShareScreen() {
      this.option.token = this.tokenGenerate();
      this.rtc.joinChannel(this.option).then(() => {
        this.rtc.publishScreenShare().then((stream) => {
          this.localStream = stream;
          this.onScreen = true;
          this.userList.push(this.option.uid);
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
      this.onScreen = false;
      this.onVoice = false;
    },
    tokenGenerate() {
      this.option.uid = document.getElementById("userId").value.toString();
      this.option.channel = document.getElementById("channelId").value.toString();
      const expirationTimeInSeconds = 7200;
      const currentTimestamp = Math.floor(Date.now() / 1000);
      const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;
      const token = RtcTokenBuilder.buildTokenWithUid(this.option.appid, this.appCertificate, this.option.channel, this.option.uid, RtcRole.PUBLISHER, privilegeExpiredTs);
      return token;
    },
    alertFunc() {
      console.log(this.option.channel);
      return this.option.channel;
    }
  },
}
</script>

<style scoped>
.agora-view {
  display: flex;
  flex-wrap: wrap;
}
.show {
  width: 600px;
  height: 400px;
}
</style>
