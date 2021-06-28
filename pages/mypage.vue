<template>
  <v-row>
    <v-col cols="8">
      <v-row>
        <input type="file" id="fileupload" hidden/>
      </v-row>
      <v-row>
        <v-btn color="primary">
          <v-icon left>
            mdi-arrow-left-circle
          </v-icon>
          내 파일함</v-btn>
        <input placeholder="제목을 입력하세요" type="text"
        style="width: 40%; background-color:white;"/>
      </v-row>
      <v-row>
<!--        <video ref="video" class="video-frame" controls autoplay muted-->
<!--               src="/hd.mp4" id="video"-->
<!--               >-->
<!--          브라우저가 비디오 플레이를 지원하지 않습니다-->
<!--        </video>-->
        <video-player  class="video-player-box"
                       ref="videoPlayer"
                       :options="playerOptions"
                       :playsinline="true"
                       customEventName="customstatechangedeventname"

                       @play="onPlayerPlay($event)"
                       @pause="onPlayerPause($event)"
                       @ended="onPlayerEnded($event)"
                       @waiting="onPlayerWaiting($event)"
                       @playing="onPlayerPlaying($event)"
                       @loadeddata="onPlayerLoadeddata($event)"
                       @timeupdate="onPlayerTimeupdate($event)"
                       @canplay="onPlayerCanplay($event)"
                       @canplaythrough="onPlayerCanplaythrough($event)"

                       @statechanged="playerStateChanged($event)"
                       @ready="playerReadied">
        </video-player>
      </v-row>
    </v-col>
    <v-col cols="4" class="comment-box">
      <v-row>
        <v-btn color="primary" @click="choiceFile">새파일</v-btn>
        <v-btn color="primary">test2</v-btn>
        <v-btn color="primary">test3</v-btn>
      </v-row>
      <v-row>
        <v-btn>노트</v-btn>
        <v-btn>코멘트</v-btn>
        <v-btn @click="capture">캡쳐</v-btn>
      </v-row>
      <v-row>
        <textarea wrap="virtual" rows="8" cols="40"
                  style="height: 450px"
                  placeholder="내용을 입력하세요"
        ></textarea>
      </v-row>
      <v-row>
        <v-btn color="primary" @click="onTimeUpDate">save</v-btn>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>

import 'videojs-markers'
import 'video.js/dist/video-js.css'
import {videoPlayer} from 'vue-video-player'

export default {
  components: {
    videoPlayer
  },
  data: {
    return: {
      playerOptions: {
        muted: true,
        langueage: 'en',
        playbackRate: [0.7, 1.0, 1.5, 2.0],
        sources: [{
          type: "video/mp4",
          src: "/hd.mp4"
        }],
      }
    }
    // currentTime: 0,
    // player: null
  },
  mounted() {
    this.player= videojs(this.$refs.video, this.options, function onPlayerReady() {
      console.log('onPlayerReady', this);
    })
  },
  beforeDestroy() {
    if (this.player) {
      this.player.dispose()
    }
  },
  methods: {
    choiceFile: function (){
      document.getElementById("fileupload").click();
    },
    onTimeUpDate: function() {
      this.currentTime = this.$refs.video.currentTime;
      this.player = videojs('video')
      this.player.markers({
        markers:[
          {time: 1},
          {time: 3}
        ]
      })
    },

    // screenShot: function() {
    //   html2canvas(this.$refs.video, {
    //     useCORS: true
    //   }).then((canvas) => {
    //     this.fileDownload(canvas.toDataURL(), "capture.png")
    //   })
    // },
    // fileDownload(downloadUrl, downloadName) {
    //   let aLink = document.createElement("a");
    //   aLink.href = downloadUrl;
    //   aLink.download = downloadName;
    //   document.body.appendChild(aLink);
    //   aLink.click();
    //   document.body.removeChild(aLink);
    // }

  }
}
</script>

<style scoped>
.comment-box{
  height: 600px;
  background-color: white;
}
.video-frame{
  max-width: 100%;
  height: auto;
}
</style>
