<template>
  <v-row>
    <v-col cols="8">
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
        <video width="100%" height="500" controls id="player" src="/hd.mp4">
        <video class="video-frame" controls autoplay muted
               src="/hd.mp4" id="videoOrigin"
               >
          브라우저가 비디오 플레이를 지원하지 않습니다
        </video>
      </v-row>
      <v-row id="draw">
        <canvas id="videoCanvas"></canvas>
        <div id="marker">

        </div>
<!--        <video id="myVideo" ref="player" class="video-js vjs-big-play-centered vjs vjs-fluid" data-setup="{}">-->
<!--          <source src="/hd.mp4" type="video/mp4">-->
<!--          브라우저가 비디오 플레이를 지원하지 않습니다-->
<!--        </video>-->
      </v-row>
    </v-col>
    <v-col cols="4" class="comment-box">
      <v-row>
        <v-btn color="primary">공유하기</v-btn>
        <v-btn color="primary" @click="drawVideo">캡쳐</v-btn>
        <v-btn color="primary">test3</v-btn>
      </v-row>
      <v-row>
        <v-btn>노트</v-btn>
        <v-btn>코멘트</v-btn>
      </v-row>
      <v-row class="edit-toolbar">
        <v-btn @click = "textEdit('bold')" >
          <v-icon>
            mdi-format-bold
          </v-icon>
        </v-btn>
        <v-btn @click = "textEdit('italic')" >
          <v-icon>
            mdi-format-italic
          </v-icon>
        </v-btn>
        <v-btn @click = "textEdit('underline')" >
          <v-icon>
            mdi-format-underline
          </v-icon>
        </v-btn>
        <v-btn @click = "textEdit('strikeThrough')" >
          <v-icon>
            mdi-format-strikethrough
          </v-icon>
        </v-btn>
      </v-row>
      <v-row>
        <div contenteditable="true" id="content-editor" aria-placeholder="제목을 입력하세요" @select="">
        </div>
        <textarea wrap="virtual" rows="8" cols="40"
                  style="height: 450px"
                  placeholder="내용을 입력하세요"
                  ref="textareaObj"
                  id="textBox"
        ></textarea>
      </v-row>
      <v-row>
        <v-btn color="primary">save</v-btn>
        <v-btn color="primary" @click="makeMarker">Mark</v-btn>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>

export default {
  methods: {
    drawVideo: function (){
      this.video = document.querySelector("#videoOrigin");
      this.canvas = document.querySelector("#videoCanvas");
      this.context = this.canvas.getContext('2d');

      this.canvas.width = this.video.clientWidth;
      this.canvas.height = this.video.clientHeight;

      this.context.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
      const imgNode = document.createElement("img");
      imgNode.src = this.canvas.toDataURL();
      imgNode.width = this.canvas.width/4;
      imgNode.height = this.canvas.height/4;

      this.editor = document.querySelector("#content-editor");
      this.editor.appendChild(imgNode);
    },
    textEdit : function(command){
      document.execCommand(command);
    choiceFile: function (){
      document.getElementById("fileupload").click();
    },
    makeMarker: function(){
      let tmp = document.getElementById("player");
      let value = this.$refs.textareaObj.value;
      let time = tmp.currentTime;
      let newBtn = document.createElement('button');
      let txt = document.createTextNode("000");
      newBtn.style.backgroundColor="red";
      newBtn.style.borderRadius = '50%';
      newBtn.appendChild(txt);
      document.getElementById('marker').appendChild(newBtn);
      newBtn.addEventListener('click', function(){
        tmp.currentTime = time;
        document.getElementById('textBox').value = value;
      });
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
#content-editor{
  width: 70%;
  height: 400px;
  border: 1px solid;
  overflow-y: auto;
}
.edit-toolbar{
  margin-bottom: 10px;
  margin-top : 10px;
}
</style>
