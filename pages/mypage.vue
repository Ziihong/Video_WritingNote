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
               @undoCall="undoExec"
               @redoCall="redoExec"
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
        <v-btn @click="visibleComment">코멘트</v-btn>
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
        <div id="content-editor">
          <tiptap-vuetify id="tiptapVue" :v-model="content" :extensions="extensions" :toolbar-attributes="{ color: 'yellow' }">
          </tiptap-vuetify>
        </div>
      </v-row>
      <v-row>
        <v-btn color="primary">save</v-btn>
        <v-btn color="primary" @click="makeMarker()">Mark</v-btn>
        <v-btn color="primary" @click="saveToPdf">PDF</v-btn>
      </v-row>
      <v-row>
        <div id="comment" style="visibility: hidden">
          <div class="owner">
            <span>{{ comments.length }}개의 comment</span>
            <div class="ownerAvatar">
              <a class="username" href="#"><img :src="creator.avatar" alt=""></a>
            </div>
            <div class="ownerName">
              <span>{{ creator.user }}</span>
            </div>
          </div>
          <div>
            <comments
              :comments_wrapper_classes="['custom-scrollbar', 'comments-wrapper']"
              :comments="comments"
              :current_user="current_user"
              @submit-comment="submitComment"
            ></comments>
          </div>
        </div>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import jsPDF from 'jspdf'
import html2canvas from "html2canvas";
import Drawing from "../components/Drawing";
import Comments from './comments';

import {
  TiptapVuetify,
  Heading,
  Bold,
  Italic,
  Strike,
  Underline,
  Code,
  Paragraph,
  BulletList,
  OrderedList,
  ListItem,
  Link,
  Blockquote,
  HardBreak,
  HorizontalRule,
  History,
  Image,
} from 'tiptap-vuetify'


export default {
  components: {
    Drawing,
    TiptapVuetify,
    Comments,
  },
  props: ["description", "menubar", "readOnly"],
  data() {
    return {
      isPainting : false,
      paintMode : 'draw',
      canvasImgsrc : '',
      brushSize : 3.5,
      curColor : '#001dff',
      undoStack : [],
      redoStack : [],
      swMenubar: this.menubar,
      linkUrl: null,
      linkMenuIsActive: false,
      editor: null,
      extensions: [
        History,
        Blockquote,
        Link,
        Underline,
        Strike,
        Italic,
        ListItem,
        BulletList,
        OrderedList,
        Image,
        [
          Heading,
          {
            options: {
              levels: [1, 2, 3]
            }
          }
        ],
        Bold,
        Link,
        Code,
        HorizontalRule,
        Paragraph,
        HardBreak,
      ],
      content: 'good morning',
      creator: {
        avatar: 'http://via.placeholder.com/100x100/a74848',
        user: 'owner'
      },
      current_user: {
        avatar: '/v.png',
        user: 'user'
      },
      comments: [],
      avatar: [
        'http://via.placeholder.com/100x100/a74848',
        'http://via.placeholder.com/100x100/2d58a7',
        'http://via.placeholder.com/100x100/36846e'
      ]
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
    submitComment: function(reply) {
      this.comments.push({
        id: this.comments.length + 1,
        user: this.current_user.user + (this.comments.length+1),
        avatar: this.avatar[Math.floor(Math.random()*this.avatar.length)],
        // avatar: this.current_user.avatar,
        text: reply
      });
    },
    visibleComment: function(){
      let commentDiv = document.querySelector("#comment")
      if(commentDiv.style.visibility === "hidden") {
        commentDiv.style.visibility = "visible";
      } else {
        commentDiv.style.visibility = "hidden";
      }
    },
    drawVideo: function () {
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
      this.undoStack.push(this.context.getImageData(0,0,this.canvas.width,this.canvas.height));

      document.getElementsByClassName("ProseMirror")[0].appendChild(imgNode);
    },
    textEdit: function (command) {
      document.execCommand(command);
    },
    choiceFile: function () {
      document.getElementById("fileupload").click();
    },
    makeMarker: function () {
      const tmp = document.querySelector("#videoOrigin");
      const time = tmp.currentTime;
      const newBtn = document.createElement("button");
      newBtn.innerHTML = '<img src="/v.png" width="20" height="20"/>';
      document.getElementsByClassName("ProseMirror")[0].appendChild(newBtn);
      newBtn.addEventListener('click', function () {
        tmp.currentTime = time;
      });
    },
    saveToPdf: function (){
      html2canvas(document.getElementsByClassName("tiptap-vuetify-editor__content")[0], {
        scale: 3,
        allowTaint: true,
        useCORS: true,
        logging: false,
        height: window.outerHeight + window.innerHeight,
      }).then(function(canvas){
        let imgData = canvas.toDataURL('image/png');
        let imgWidth = 210;
        let pageHeight = imgWidth * 1.414;
        let imgHeight = canvas.height * imgWidth / canvas.width;
        let heightLeft =  imgHeight;
        let doc = new jsPDF('p', 'mm');
        let position = -1;

        doc.addImage(imgData, 'PNG', -6, position, imgWidth, imgHeight);

        // heightLeft -= pageHeight;
        // while(heightLeft >= 20){
        //  position -= heightLeft - imgHeight;
        //  doc.addPage();
        //  doc.addImage(imgData, 'PNG', -6, position, imgWidth, imgHeight);
        //  heightLeft -= pageHeight;
        //}
        doc.save('sample.pdf');
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
      this.context.lineWidth = this.brushSize;

      if(!this.isPainting){
        this.context.beginPath();
        this.context.moveTo(x,y);
      }
      else{
        if(this.paintMode==='light'){
          this.context.globalAlpha = 0.03;
          this.context.lineWidth = this.brushSize*2;
        }
        // else if(this.paintMode==='erase'){
        //   this.context.globalCompositeOperation = "destination-out";
        //   this.context.strokeStyle = "rgba(0,0,0,1)";
        //   console.log('erase');
        // }
        this.context.lineTo(x,y);
        this.context.stroke();
      }
    },
    stopPainting: function (){
      if(this.isPainting===true){
        this.undoStack.push(this.context.getImageData(0,0,this.canvas.width,this.canvas.height));
        this.redoStack.length=0;
      }
      this.isPainting = false;
      this.canvas = document.querySelector("#videoCanvas");
      this.context = this.canvas.getContext('2d');
    },
    undoExec: function (){
      if (this.undoStack.length <= 1){
        return;
      }
      this.canvas = document.querySelector("#videoCanvas");
      this.context = this.canvas.getContext('2d');
      this.redoStack.push(this.undoStack[this.undoStack.length - 1]);
      this.undoStack.pop();
      this.context.putImageData(this.undoStack[this.undoStack.length - 1],0,0);
    },
    redoExec: function (){
      if (this.redoStack.length < 1){
        return;
      }
      this.canvas = document.querySelector("#videoCanvas");
      this.context = this.canvas.getContext('2d');
      this.undoStack.push(this.redoStack[this.redoStack.length - 1]);
      this.context.putImageData(this.redoStack[this.redoStack.length - 1],0,0);
      this.redoStack.pop();
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
  position: relative;
  display: flex;
  /*width: 70%;*/
  /*height: 400px;*/
  /*border: 1px solid;*/
  /*overflow-y: auto;*/
}
.edit-toolbar{
  margin-bottom: 10px;
  margin-top : 10px;
}
#comment {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.owner .ownerAvatar > a > img {
  width: 40px;
  height: 40px;
  border-radius: 100%;
}
</style>
