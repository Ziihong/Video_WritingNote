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
        <canvas id="videoCanvas" ref="textarea"></canvas>
        <div id="marker"></div>
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
        <div id="content-editor">
        </div>
        <div id="app">
          <froala :tag="'textarea'" :config="config" v-model="model">Init text</froala>
        </div>
      </v-row>
      <v-row>
        <v-btn color="primary">save</v-btn>
        <v-btn color="primary" @click.stop="makeMarker()">Mark</v-btn>
        <v-btn color="primary" @click="saveToPdf">PDF</v-btn>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import jsPDF from 'jspdf'
import html2canvas from "html2canvas";
import VueFroala from 'vue-froala-wysiwyg';

export default {
  data () {
    return {
      config: {
        events: {
          initialized: function () {
            console.log('initialized')
          }
        },
        placeholderText: "Edit Your Content Here!",
        charCounterCount: false
      },
      model: 'Edit Your Content Here!'
    }
  },
  methods: {
    drawVideo: function () {
      this.video = document.querySelector("#videoOrigin");
      this.canvas = document.querySelector("#videoCanvas");
      this.context = this.canvas.getContext('2d');

      this.canvas.width = this.video.clientWidth;
      this.canvas.height = this.video.clientHeight;

      this.context.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
      const imgNode = document.createElement("img");
      imgNode.src = this.canvas.toDataURL();
      imgNode.width = this.canvas.width / 4;
      imgNode.height = this.canvas.height / 4;

      this.editor = document.querySelector("#content-editor");
      this.editor.appendChild(imgNode);
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
      document.querySelector("#content-editor").appendChild(newBtn);
      newBtn.addEventListener('click', function () {
        tmp.currentTime = time;
      });
    },
    keydownFunc: function (e) {
      if (e.keyCode === 13) {
        document.execCommand('insertHTML', false, '');
      }
    },
    saveToPdf: function (){
      html2canvas(document.querySelector("#content-editor"), {
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
        console.log(imgHeight);
        let heightLeft =  imgHeight;
        let doc = new jsPDF('p', 'mm');
        let position = -1;

        doc.addImage(imgData, 'PNG', -6, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while(heightLeft >= 20){
          position -= heightLeft - imgHeight;
          doc.addPage();
          doc.addImage(imgData, 'PNG', -6, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
        doc.save('sample.pdf');
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
}
.edit-toolbar{
  margin-bottom: 10px;
  margin-top : 10px;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
