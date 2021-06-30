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
        <video class="video-frame" controls autoplay muted
               src="/hd.mp4" id="videoOrigin" width="100%" height="500"
        >
          브라우저가 비디오 플레이를 지원하지 않습니다
        </video>
      </v-row>
      <v-row id="draw">
        <canvas id="videoCanvas" ref="textarea"
                @mousemove="canvasMousemove"
                @mousedown="canvasMousedown"
                @mouseleave="stopPainting"
                @mouseup="stopPainting"
        ></canvas>
        <div id="marker"></div>
      </v-row>
      <Drawing @colorCall="colorChange"
               @modeCall="selectMode"
               @clearCall="canvasClear"
               @rangeCall="rangeChange"
      ></Drawing>
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
        <div contenteditable="true" id="content-editor">
        </div>
      </v-row>
      <v-row>
        <v-btn color="primary">save</v-btn>
        <v-btn color="primary" @click="makeMarker">Mark</v-btn>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>

import Drawing from "../components/Drawing";
export default {
  components: {
    Drawing
  },
  data() {
    return {
      isPainting : false,
      paintMode : 'draw',
      canvasImgsrc : '',
      brushSize : 3.5,
      curColor : '#001dff',
    };
  },
  mounted() {
    this.canvas = document.querySelector("#videoCanvas");
    this.context = this.canvas.getContext('2d');
    this.context.strokeStyle = '#001dff';
    this.context.fillStyle = '#001dff';
    this.context.lineWidth = 3.5;
  },
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
      this.canvasImgsrc = this.canvas.toDataURL();
      imgNode.width = this.canvas.width/4;
      imgNode.height = this.canvas.height/4;
      this.context.strokeStyle = this.curColor;
      this.context.fillStyle = this.curColor;
      this.context.lineWidth = this.brushSize;

      this.editor = document.querySelector("#content-editor");
      this.editor.appendChild(imgNode);
    },
    textEdit : function(command) {
      document.execCommand(command);
    },
    choiceFile: function (){
      document.getElementById("fileupload").click();
    },
    makeMarker: function(){
      let tmp = document.querySelector("#videoOrigin");
      let time = tmp.currentTime;
      let newBtn = document.createElement("button");

      newBtn.classList.add('timebtn');
      newBtn.style.backgroundColor = 'red';
      newBtn.innerText = "0000";
      this.editor = document.querySelector("#content-editor");
      this.editor.appendChild(newBtn);
      newBtn.addEventListener('click', function(){
        tmp.currentTime = time;
      });
    },
    colorChange: function (color){
      const self = this;
      self.canvas = document.querySelector("#videoCanvas");
      self.context = this.canvas.getContext('2d');
      self.curColor = color;

      self.context.strokeStyle = color;
    },
    rangeChange: function (range){
      this.canvas = document.querySelector("#videoCanvas");
      this.context = this.canvas.getContext('2d');
      this.context.lineWidth = range;
      this.brushSize = range;
    },
    selectMode: function (mode){
      if(mode==='select'||mode==='text') this.isPainting = false;
      this.paintMode = mode;
    },
    canvasMousedown: function (event){
      if(!this.isPainting && (this.paintMode==='draw'||this.paintMode==='light') ) this.isPainting = true;
    },
    canvasMousemove: function (event){
      const x = event.offsetX;
      const y = event.offsetY;
      this.canvas = document.querySelector("#videoCanvas");
      this.context = this.canvas.getContext('2d');
      this.context.globalAlpha = 1;

      if(!this.isPainting){
        this.context.beginPath();
        this.context.moveTo(x,y);
      }
      else{
        if(this.paintMode==='light'){
          this.context.globalAlpha = 0.03;
          this.context.lineWidth = this.brushSize*2;
        }
        this.context.lineTo(x,y);
        this.context.stroke();
      }
    },
    stopPainting: function (){
      this.isPainting = false;
    },
    canvasClear: function (){
      const img = new Image();
      img.src = this.canvasImgsrc;
      this.canvas = document.querySelector("#videoCanvas");
      this.context = this.canvas.getContext('2d');
      this.context.globalAlpha = 1;
      this.context.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
    },
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
.timebtn{
  width: 50px;
  height: 50px;
  background-color: lime;
  borderRadius : 50%;
}
</style>
