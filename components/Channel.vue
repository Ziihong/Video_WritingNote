<template>
  <v-dialog transition="dialog-bottom-transition" max-width="600">
    <template v-slot:activator="{ on, attrs }">
        <v-btn color="primary" v-bind="attrs" v-on="on">새 방</v-btn>
    </template>
    <template v-slot:default="dialog">
      <v-card>
        <v-toolbar color="primary" dark>접속 정보</v-toolbar>
        <div class='informBox'>
          <div v-if="!localStream">
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
          </div>
          <div v-else class="agora-text">Connected to channel</div>
          <div class="agora-button">
            <v-btn type="primary" @click="joinEvent">join</v-btn>
            <v-btn type="primary" @click='leaveEvent'>leave</v-btn>
          </div>
        </div>
        <v-card-actions class="justify-end">
          <v-btn text @click="dialog.value = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
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
      this.rtc.joinChannel(this.option).then((stream) => {
        alert("Join Success");
        this.$emit('join-event');
        this.rtc.publishStream().then((stream) => {
          alert("Publish Success");
          this.localStream = stream
        }).catch((e) => {
          alert("Publish Failure");
          console.log(e)
        })
      }).catch((e) => {
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
      this.$emit('leave-event')
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
