<template>
  <div id="content">
    <up-file-btn></up-file-btn>
    <up-dir-btn></up-dir-btn>
    <div class="wrap">
      <v-btn color="primary" @click="startScreenShare">Start</v-btn>
      <video id="videoOrigin" autoplay></video>
    </div>
  </div>
</template>

<script>

import UpFileBtn from "../components/UpFileBtn";
import UpDirBtn from "../components/UpDirBtn";
export default {
  components: {UpDirBtn, UpFileBtn},
  data() {
    return {
      constraints: {
        audio: true,
        video: {
          width: 1980, // 최대 너비
          height: 1080, // 최대 높이
          frameRate: 10, // 최대 프레임
        },
      }
    }
  },
  methods: {
    async startScreenShare() {
      console.log("Start screen share!");
      const stream = await this.start();
      this.onLocalStream(stream);
    },
    async start() {
      let localStream;
      try {
        localStream = await this.getCrossBrowserScreenCapture();
      } catch (err) {
        console.error('Error getDisplayMedia', err);
      }
      return localStream;
    },
    onLocalStream(stream) {
      console.log('onLocalStream', stream);
      const $video = document.querySelector('#videoOrigin');
      $video.srcObject = stream;
    },
    getCrossBrowserScreenCapture() {
      if (navigator.getDisplayMedia) {
        return navigator.getDisplayMedia(this.constraints);
      } else if (navigator.mediaDevices.getDisplayMedia) {
        return navigator.mediaDevices.getDisplayMedia(this.constraints);
      }
    },
  }
}


</script>

<style scoped>
button {
  cursor: pointer;
  margin: 0 0 1em 0;
  padding: 0.4em 0.7em 0.5em 0.7em;
  min-width: 100px;
  border-radius: 2px;
  color: white;
  font-size: 1em;
}

.wrap {
  width: 720px;
  margin: 0 auto;
}

video {
  margin: 0 0 20px 0;
  width: 100%;
  background: #222;
}

</style>
