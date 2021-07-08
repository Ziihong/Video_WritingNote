<template>
  <v-row>
    <v-col cols="8">
      <v-row>
        <div id="dimmed" class="hidden" @click="closePopup"></div>
        <div id="canvas-container" class="hidden">
          <Drawing @colorCall="colorChange"
                   @modeCall="selectMode"
                   @clearCall="canvasClear"
                   @rangeCall="rangeChange"
                   @undoCall="undoExec"
                   @redoCall="redoExec"
          ></Drawing>
          <canvas id="drawing-canvas"
          @mousemove="canvasMousemove"
          @mousedown="canvasMousedown"
          @mouseleave="stopPainting"
          @mouseup="stopPainting"></canvas>
        </div>
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
        <canvas id="videoCanvas" ref="textarea" class="hidden"
                @mousemove="canvasMousemove"
                @mousedown="canvasMousedown"
                @mouseleave="stopPainting"
                @mouseup="stopPainting"
        ></canvas>
        <v-stepper v-model="el">
          <v-stepper-header>
            <v-stepper-step v-for="mark of marks" v-bind:key="mark.timeline"
            :step="mark.data().time.toFixed(1)">
              <v-btn @click="goToMarkTime(mark.data().time)">
                <img src="/v.png" width="20" height="20">
                <v-icon right @click="removeMark(mark)">mdi-close-box</v-icon>
              </v-btn>
            </v-stepper-step>
          </v-stepper-header>
        </v-stepper>
      </v-row>
    </v-col>
    <v-col cols="4" class="comment-box">
      <v-row>
        <v-btn color="primary">공유하기</v-btn>
        <v-btn color="primary" @click="drawVideo">캡쳐</v-btn>
      </v-row>
      <v-row>
        <v-btn>노트</v-btn>
        <v-dialog transition="dialog-bottom-transition" max-width="600">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" v-bind="attrs" v-on="on">코멘트</v-btn>
          </template>
          <template v-slot:default="dialog">
            <v-card>
              <v-toolbar color="primary" dark>코멘트</v-toolbar>
              <div>
                <comments
                  :creator="creator"
                  :comments="comments"
                  :current_user="current_user"
                  @submit-comment="submitComment">
                </comments>
              </div>
              <v-card-actions class="justify-end">
                <v-btn text @click="dialog.value = false">Close</v-btn>
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog>
      </v-row>
      <div class="edit-toolbar">
        <toolbar></toolbar>
      </div>
      <v-row>
        <div id="content-editor" contenteditable="true">
          <template v-for="note of notes">
            <div>
              {{note.data().text}}
            </div>
          </template>
        </div>
      </v-row>
      <v-row>
        <v-btn color="primary" @click="onSaveNote">save</v-btn>
        <v-btn color="primary" @click="makeMarker">Mark</v-btn>
        <v-btn color="primary" @click="saveToPdf">PDF</v-btn>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import jsPDF from 'jspdf'
import html2canvas from "html2canvas";
import Drawing from "../components/Drawing";
import Comments from '../components/comments';
import toolbar from "../components/toolbar";

export default {
  components: {
    Drawing,
    Comments,
    toolbar,
  },
  data() {
    return {
      el: '1',
      description: '',
      name: '',
      comments: [],
      commentObj: null,
      notes: [],
      noteUrls: [],
      isUploading: false,
      commentUrls: [],
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
      marks: [],
      markUrls: [],
      editor: null,
      content: '',
      creator: {
        avatar: 'http://via.placeholder.com/100x100/a74848',
        user: 'owner'
      },
      current_user: {
        avatar: 'http://via.placeholder.com/100x100/36846e',
        user: 'user',
      },
    };
  },
  mounted() {
    this.canvas = document.querySelector("#videoCanvas");
    this.context = this.canvas.getContext('2d');
    this.context.strokeStyle = '#001dff';
    this.context.fillStyle = '#001dff';
    this.context.lineWidth = 3.5;
    if(!this.$fire.auth.currentUser)
      return;
    this.$fire.firestore.doc(`users/${this.$fire.auth.currentUser.uid}`).get().then(docSnap => {
      if (docSnap.exists) {
        this.name = docSnap.data().name;
        this.description = docSnap.data().description;
      } else {
        console.log('');
      }
    });

    this.$fire.firestore.doc(`users/${this.$fire.auth.currentUser.uid}`).
    collection('comments').orderBy('timestamp').onSnapshot((async querySnapshot => {
      this.comments = querySnapshot.docs;
      const self = this;
      this.commentUrls = await Promise.all(this.comments.map(comment => comment.data().path ? self.$fire.storage.ref(comment.data().path).getDownloadURL() : ''));
    }));

    this.$fire.firestore.doc(`users/${this.$fire.auth.currentUser.uid}`).
    collection('notes').orderBy('timestamp').onSnapshot((async querySnapshot => {
      this.notes = querySnapshot.docs;
      const self = this;
      this.noteUrls = await Promise.all(this.notes.map(note => note.data().path ? self.$fire.storage.ref(note.data().path).getDownloadURL() : ''));
    }));

    this.$fire.firestore.doc(`users/${this.$fire.auth.currentUser.uid}`).
    collection('marks').orderBy('timestamp').onSnapshot((async querySnapshot => {
      this.marks = querySnapshot.docs;
      const self = this;
      this.markUrls = await Promise.all(this.marks.map(mark => mark.data().path ? self.$fire.storage.ref(mark.data().path).getDownloadURL() : ''));
    }));
  },
  methods: {
    async onSaveNote() {
      this.$fire.firestore.doc(`users/${this.$fire.auth.currentUser.uid}`).
      set({name: this.name}, {merge: true}).
      then(para => {
        console.log('Save test : '+para);
      });

      this.noteTexts = document.getElementById('content-editor').getElementsByTagName('div');
      const self = this;
      const arr = [];
      //contentEditable div text
      let strSplit = document.getElementById('content-editor').innerHTML.split('<div>');
      if(this.notes.length === 0){
        arr.push(strSplit[0]);
      }
      for(let i=0; i<self.noteTexts.length; i++){
        arr.push(self.noteTexts[i].innerText);
      }

      let i = this.notes.length;
      while(i !== 0){
        await this.$fire.firestore.doc(`users/${this.$fire.auth.currentUser.uid}/notes/${this.notes[0].id}`).delete();
        i--;
      }

      for(const i of arr){
        await self.$fire.firestore.collection(`users/${self.$fire.auth.currentUser.uid}/notes`).add({
          text: i,
          timestamp: self.$fireModule.firestore.FieldValue.serverTimestamp()
        });
      }

      this.notes = [];
      const fileStorageRef = this.$fire.firestore
        .collection(`users/${this.$fire.auth.currentUser.uid}/notes`);
      fileStorageRef.orderBy('timestamp')
        .onSnapshot((async querySnapshot => {
          //console.log(querySnapshot.docs.length);
          this.notes = querySnapshot.docs;
          const self = this;
          this.noteUrls = await Promise.all(this.notes.map(note => note.data().path ? self.$fire.storage.ref(note.data().path).getDownloadURL() : ''));
        }));
      document.getElementById('content-editor').innerHTML = "";
    },
    async removeMark(mark) {
      await this.$fire.firestore.doc(`users/${this.$fire.auth.currentUser.uid}/marks/${mark.id}`).delete();
    },
    async submitComment(reply) {
      this.$fire.firestore.doc(`users/${this.$fire.auth.currentUser.uid}`).
      set({name: this.name}, {merge: true}).
      then(para => {
        console.log('Save test : '+para);
      });

      const self = this;
      await self.$fire.firestore.collection(`users/${self.$fire.auth.currentUser.uid}/comments`).add({
        avatar: self.current_user.avatar,
        texts: reply,
        timestamp: self.$fireModule.firestore.FieldValue.serverTimestamp()
      });

      this.comments = [];
      const fileStorageRef = this.$fire.firestore
        .collection(`users/${this.$fire.auth.currentUser.uid}/comments`);
      fileStorageRef.orderBy('timestamp')
        .onSnapshot((async querySnapshot => {
          //console.log(querySnapshot.docs.length);
          this.comments = querySnapshot.docs;
          const self = this;
          this.commentUrls = await Promise.all(this.comments.map(comment => comment.data().path ? self.$fire.storage.ref(comment.data().path).getDownloadURL() : ''));
        }));
    },
    async modifyComment(comment, reply) {
      this.renameObj = comment;
      await this.$fire.firestore
        .doc(`users/${this.$fire.auth.currentUser.uid}/comments/${this.renameObj.id}`)
        .update({
          texts: reply,
        })
    },
    drawVideo: function () {
      this.video = document.querySelector("#videoOrigin");
      this.canvas = document.querySelector("#videoCanvas");
      this.context = this.canvas.getContext('2d');
      this.drawcanvas = document.querySelector("#drawing-canvas");
      this.drawcontext = this.canvas.getContext('2d');

      this.canvas.width = this.video.clientWidth;
      this.canvas.height = this.video.clientHeight;
      this.drawcanvas.width = this.video.clientWidth;
      this.drawcanvas.height = this.video.clientHeight;

      this.context.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
      const imgNode = document.createElement("img");
      imgNode.src = this.canvas.toDataURL();

      this.canvasImgsrc = this.canvas.toDataURL();
      imgNode.width = this.canvas.width/4;
      imgNode.height = this.canvas.height/4;

      imgNode.addEventListener("click",this.popupCanvas);

      document.getElementById('content-editor').appendChild(imgNode);
      //document.getElementsByClassName("ProseMirror")[0].appendChild(imgNode);
    },
    choiceFile: function () {
      document.getElementById("fileupload").click();
    },
    async makeMarker() {
      const originVideo = document.querySelector("#videoOrigin");

      this.$fire.firestore.doc(`users/${this.$fire.auth.currentUser.uid}`).
      set({name: this.name}, {merge: true}).
      then(para => {
        console.log('Save test : '+para);
      });

      const self = this;
      await self.$fire.firestore.collection(`users/${self.$fire.auth.currentUser.uid}/marks`).add({
        time: originVideo.currentTime,
        timestamp: self.$fireModule.firestore.FieldValue.serverTimestamp()
      });

      this.marks = [];
      const fileStorageRef = this.$fire.firestore
        .collection(`users/${this.$fire.auth.currentUser.uid}/marks`);
      fileStorageRef.orderBy('timestamp')
        .onSnapshot((async querySnapshot => {
          //console.log(querySnapshot.docs.length);
          this.marks = querySnapshot.docs;
          const self = this;
          this.markUrls = await Promise.all(this.marks.map(mark => mark.data().path ? self.$fire.storage.ref(mark.data().path).getDownloadURL() : ''));
        }));
    },
    goToMarkTime: function(time) {
      const originVideo = document.querySelector("#videoOrigin");
      originVideo.currentTime = time;
    },
    saveToPdf: function () {
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
      self.canvas = document.querySelector("#drawing-canvas");
      self.context = this.canvas.getContext('2d');
      self.curColor = color;

      self.context.strokeStyle = color;
    },
    rangeChange: function (range){
      this.vidcanvas = document.querySelector("#videoCanvas");
      this.vidcontext = this.canvas.getContext('2d');
      this.canvas = document.querySelector("#drawing-canvas");
      this.context = this.canvas.getContext('2d');
      this.context.lineWidth = range;
      this.vidcontext.lineWidth = range;
      this.brushSize = range;
    },
    selectMode: function (mode){
      if(mode==='select'||mode==='text') this.isPainting = false;
      this.paintMode = mode;
    },
    canvasMousedown: function (){
      if(!this.isPainting && (this.paintMode==='draw'||this.paintMode==='light') ) this.isPainting = true;
    },
    canvasMousemove: function (event){
      const x = event.offsetX;
      const y = event.offsetY;

      const self = this;
      self.canvas = document.querySelector("#drawing-canvas");
      self.context = self.canvas.getContext('2d');
      this.consize = document.querySelector('#canvas-container');
      self.context.globalAlpha = 1;
      self.context.lineWidth = this.brushSize;
      console.log('canvas size : '+this.consize.clientWidth+' ,'+this.consize.clientHeight);

      if(!this.isPainting){
        self.context.beginPath();
        self.context.moveTo(x,y);
      }
      else{
        if(this.paintMode==='light'){
          self.context.globalAlpha = 0.03;
          self.context.lineWidth = self.brushSize*2;
        }
        // else if(this.paintMode==='erase'){
        //   this.context.globalCompositeOperation = "destination-out";
        //   this.context.strokeStyle = "rgba(0,0,0,1)";
        //   console.log('erase');
        // }
        self.context.lineTo(x,y);
        self.context.stroke();
      }
    },
    stopPainting: function (){
      this.canvas = document.querySelector("#drawing-canvas");
      this.context = this.canvas.getContext('2d');
      if(this.isPainting===true){
        this.undoStack.push(this.context.getImageData(0,0,this.canvas.width,this.canvas.height));
        this.redoStack.length=0;
      }
      this.isPainting = false;
    },
    undoExec: function (){
      if (this.undoStack.length <= 1){
        return;
      }
      this.canvas = document.querySelector("#drawing-canvas");
      this.context = this.canvas.getContext('2d');
      this.redoStack.push(this.undoStack[this.undoStack.length - 1]);
      this.undoStack.pop();
      this.context.putImageData(this.undoStack[this.undoStack.length - 1],0,0);
    },
    redoExec: function (){
      if (this.redoStack.length < 1){
        return;
      }
      this.canvas = document.querySelector("#drawing-canvas");
      this.context = this.canvas.getContext('2d');
      this.undoStack.push(this.redoStack[this.redoStack.length - 1]);
      this.context.putImageData(this.redoStack[this.redoStack.length - 1],0,0);
      this.redoStack.pop();
    },
    canvasClear: function (){
      const originImg = document.createElement('img');
      originImg.src = this.canvasImgsrc;
      this.canvas = document.querySelector("#drawing-canvas");
      this.context = this.canvas.getContext('2d');

      this.context.drawImage(originImg, 0, 0, this.canvas.width, this.canvas.height);
      this.undoStack.push(this.context.getImageData(0,0,this.canvas.width,this.canvas.height));
    },
    popupCanvas: function (event){
      document.getElementById('dimmed').classList.remove('hidden');
      document.getElementById('canvas-container').classList.remove('hidden');
      this.canvas = document.getElementById('drawing-canvas');
      this.context = this.canvas.getContext('2d');
      const printImg = document.createElement('img');

      this.canvasImgsrc = event.target.src;
      printImg.src = event.target.src;
      this.context.drawImage(printImg, 0, 0, this.canvas.width, this.canvas.height);
      this.undoStack.push(this.context.getImageData(0,0,this.canvas.width,this.canvas.height));

      this.context.strokeStyle = this.curColor;
      this.context.lineWidth = this.brushSize;
      console.log('canvas wid, hei '+this.canvas.width+' '+this.canvas.height);
    },
    closePopup: function (){
      document.getElementById('dimmed').classList.add('hidden');
      document.getElementById('canvas-container').classList.add('hidden');
      this.undoStack.length = 0;
      this.redoStack.length = 0;
    }
  }
}
</script>

<style scoped>
.comment-box{
  height: 600px;
}
.video-frame{
  max-width: 100%;
  height: auto;
}
#content-editor{
  position: relative;
  width: 70%;
  height: 600px;
  padding: 10px;
  border: 1px solid;
  overflow-y: auto;
}
#dimmed{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #000;
  opacity: .8;
  z-index: 10;
}
#canvas-container{
  position: absolute;
  top : auto;
  left: auto;
  width: 80%;
  height: auto;
  padding: 1%;
  background-color: white;
  z-index: 100;
}
#drawing-canvas{
  /*width: 80%;*/
  /*height: auto;*/
  background-color: dimgrey;
  object-fit: cover;
}
.hidden{
  display: none;
}
</style>
