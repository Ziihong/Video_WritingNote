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
import StreamPlayer from "../components/StreamPlayer";
import AgoraRTC from "agora-rtc-sdk";

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
    joinChannel(option) {
      return new Promise((resolve, reject) => {
        this.client = AgoraRTC.createClient({mode: "rtc", codec: "vp8"})
        this.client.init(option.appid, () => {
          console.log("init success")
          // this.clientListener()
          this.client.join(option.token ? option.token : null, option.channel, null, (uid) => {
            console.log("join channel: " + this.option.channel + " success, uid: ", uid)
            this.option = {
              appid: option.appid,
              token: option.token,
              channel: option.channel,
              uid: uid,
            }
            resolve()
          }, (err) => {
            console.error("client join failed", err)
          })
        }, (err) => {
          reject(err)
          console.error(err)
        })
        console.log("[agora-vue] appId", option.appid)
      })
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
    leaveChannel() {
      return new Promise((resolve, reject) => {
        // Leave the channel
        this.client.unpublish(this.stream, (err) => {
          console.log(err)
        })
        this.client.leave(() => {
          // Stop playing the local stream
          if (this.stream.isPlaying()) {
            this.stream.stop()
          }
          // Close the local stream
          this.stream.close()
          this.client = null
          resolve()
          console.log("client leaves channel success");
        }, (err) => {
          reject(err)
          console.log("channel leave failed");
          console.error(err);
        })
      })
    }
  },
  created() {
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
