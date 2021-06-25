<template>
  <v-row ref="screen" justify="left" align="left">
    <v-col cols="8">
      <video controls src="/hd.mp4" class="videoHd"></video>
      <div class="rightDiv">
        <v-btn color="white" @click="" class="note">노트</v-btn>
        <v-btn color="white" @click="" class="comment">코멘트</v-btn>
        <v-btn @click="screenShot">캡쳐</v-btn>
        <br><br>
        <input v-if="!isLoggedIn" type="text" placeholder="로그인 후 가능합니다." class="textBoxN" disabled/>
        <input v-else type="text" placeholder="노트를 쓰세요" class="textBoxY"/>
      </div>
    </v-col>
  </v-row>
</template>

<script>

import {mapGetters, mapState} from "vuex";
import html2canvas from 'html2canvas';

export default {
  computed: {
    ...mapState({
      authUser: state => state.authUser,
    }),
    ...mapGetters({
      isLoggedIn: 'isLoggedIn',
    }),
  },
  methods: {
    async noteClick() {

    },
    screenShot () {
      html2canvas(this.$refs.screen, {
        useCORS: true
      }).then((canvas) => {
        if (navigator.msSaveBlob) { // IE10+
          let blob = canvas.msToBlob();
          return navigator.msSaveBlob(blob, name);
        } else {
          let imageurl = canvas.toDataURL('image/png')
          //You need to choose the naming rules yourself
          let imagename = ""
          this.fileDownload(imageurl, imagename)
        }
      })
    },
    fileDownload(downloadUrl, downloadName) {
      let aLink = document.createElement("a");
      aLink.style.display = "none";
      aLink.href = downloadUrl;
      aLink.download = `${downloadName}.png`;
      document.body.appendChild(aLink);
      aLink.click();
      document.body.removeChild(aLink);
    }
}

}
</script>

<style scoped>
.videoHd {
  position: absolute;
  left: 100px;
  width: 50%;
  height: 600px;
}
.rightDiv {
  position: absolute;
  right: 100px;
}
.note {
  background-color: white;
  border: 1px solid black;
}
.textBoxN {
  border: 1px solid grey;
  width: 70%;
  height: 300px;
}
.textBoxY {
  border: 1px solid grey;
  width: 70%;
  height: 300px;
}
</style>
