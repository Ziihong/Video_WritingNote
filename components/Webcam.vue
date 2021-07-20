<template>
  <div>
    <div class='informBox'>
      <div class="inputToAccess">
        <div class="agora-text">Appid</div>
        <input v-model="option.appid" class="inputBox" placeholder="Appid">
      </div>
      <div class="inputToAccess">
        <div class="agora-text">Token</div>
        <input v-model="option.token" class="inputBox" placeholder="Token">
      </div>
      <div class="inputToAccess">
        <div class="agora-text">Channel Name</div>
        <input v-model="option.channel" class="inputBox" placeholder="Channel Name">
      </div>
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
import RTCClient from "../static/agora-rtc-client";
import StreamPlayer from "../components/StreamPlayer";

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
    }
  },
  props: {
  },
  methods: {
    joinEvent () {
      if(!this.option.appid) {
        this.judge('Appid')
        return
      }
      if(!this.option.channel) {
        this.judge('Channel Name')
        return
      }
      this.rtc.joinChannel(this.option).then(() => {
        alert("Join Success");

        this.rtc.publishStream().then((stream) => {
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
      this.rtc.leaveChannel().then(() => {
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
  },
  created() {
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
      alert(`Peer ${event.uid} is online`);
    })

    rtc.on('peer-leave', (event) => {
      alert(`Peer ${event.uid} already leave`);
      this.remoteStreams = this.remoteStreams.filter((it) => it.getId() !== event.uid)
    })
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
