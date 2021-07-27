<template>

</template>

<script>
import AgoraRTC from 'agora-rtc-sdk';
import AgoraRTM from "agora-rtm-sdk";

export default{
  data(){
    return{
      appid:"",
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
  created(){
    this.appId = "e0137c98e86c47b58b38606d42109aca";
    this.appCertificate = "0899f451a3b048dcb073db0f2f7c3f37";

    // 클라이언트 인스턴스 생성
    this.clientID = AgoraRTC.createClient(this.appId);
    console.log("1. clientId: ", this.clientId);
    const self = this;
  },
}

</script>


<!--<template>-->
<!--  <div id="content">-->
<!--    <div class="wrap">-->
<!--      <v-btn color="primary" @click="startScreenShare">Start</v-btn>-->
<!--      <video id="videoOrigin" autoplay></video>-->
<!--    </div>-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--export default {-->
<!--  data() {-->
<!--    return {-->
<!--      constraints: {-->
<!--        audio: true,-->
<!--        video: {-->
<!--          width: 1980, // 최대 너비-->
<!--          height: 1080, // 최대 높이-->
<!--          frameRate: 10, // 최대 프레임-->
<!--        },-->
<!--      }-->
<!--    }-->
<!--  },-->
<!--  methods: {-->
<!--    async startScreenShare() {-->
<!--      console.log("Start screen share!");-->
<!--      const stream = await this.start();-->
<!--      this.onLocalStream(stream);-->
<!--    },-->
<!--    async start() {-->
<!--      let localStream;-->
<!--      try {-->
<!--        localStream = await this.getCrossBrowserScreenCapture();-->
<!--      } catch (err) {-->
<!--        console.error('Error getDisplayMedia', err);-->
<!--      }-->
<!--      return localStream;-->
<!--    },-->
<!--    onLocalStream(stream) {-->
<!--      console.log('onLocalStream', stream);-->
<!--      const $video = document.querySelector('#videoOrigin');-->
<!--      $video.srcObject = stream;-->
<!--    },-->
<!--    getCrossBrowserScreenCapture() {-->
<!--      if (navigator.getDisplayMedia) {-->
<!--        return navigator.getDisplayMedia(this.constraints);-->
<!--      } else if (navigator.mediaDevices.getDisplayMedia) {-->
<!--        return navigator.mediaDevices.getDisplayMedia(this.constraints);-->
<!--      }-->
<!--    },-->
<!--  }-->
<!--}-->


<!--</script>-->

<!--<style scoped>-->
<!--button {-->
<!--  cursor: pointer;-->
<!--  margin: 0 0 1em 0;-->
<!--  padding: 0.4em 0.7em 0.5em 0.7em;-->
<!--  min-width: 100px;-->
<!--  border-radius: 2px;-->
<!--  color: white;-->
<!--  font-size: 1em;-->
<!--}-->

<!--.wrap {-->
<!--  width: 720px;-->
<!--  margin: 0 auto;-->
<!--}-->

<!--video {-->
<!--  margin: 0 0 20px 0;-->
<!--  width: 100%;-->
<!--  height: auto;-->
<!--  background: #222;-->
<!--}-->

<!--</style>-->
