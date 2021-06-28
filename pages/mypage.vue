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
        <video class="video-frame" controls autoplay muted
               src="/hd.mp4" id="videoOrigin"
               >
          브라우저가 비디오 플레이를 지원하지 않습니다
        </video>

      </v-row>
      <v-row id="draw">
        <p>canvas below here</p>
        <canvas id="videoCanvas"></canvas>
      </v-row>
    </v-col>
    <v-col cols="4" class="comment-box">
      <v-row>
        <v-btn color="primary" @click="choiceFile">새파일</v-btn>
        <v-btn color="primary" @click="drawVideo">test2</v-btn>
        <v-btn color="primary">test3</v-btn>
      </v-row>
      <v-row>
        <v-btn>노트</v-btn>
        <v-btn>코멘트</v-btn>
      </v-row>
      <v-row>
        <textarea wrap="virtual" rows="8" cols="40"
                  style="height: 450px"
                  placeholder="내용을 입력하세요"
        ></textarea>
      </v-row>
      <v-row>
        <v-btn color="primary">save</v-btn>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>

import html2canvas from "html2canvas";

export default {
  methods: {
    choiceFile: function (){
      document.getElementById("fileupload").click();
    },
    drawVideo: function (){
      this.video = document.querySelector("#videoOrigin");
      this.canvas = document.querySelector("#videoCanvas");
      this.context = this.canvas.getContext('2d');

      this.canvas.width = this.video.clientWidth;
      this.canvas.height = this.video.clientHeight;

      this.context.drawImage(this.video, 0, 0, this.video.width, this.video.height);
      console.log(this.canvas);
      console.log(this.context.getImageData(0,0,this.canvas.clientWidth,this.canvas.clientHeight));
      /*
      const video = document.querySelector("#videoOrigin");
      html2canvas(video).then(canvas =>{
        let a = document.createElement("a");
        a.href = canvas.toDataURL("image/jpeg").replace("image/jpeg","image/octet-stream");
        a.download = "out.jpg";
        a.click();
        document.querySelector("#draw").appendChild(canvas)
      });*/
    }
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
