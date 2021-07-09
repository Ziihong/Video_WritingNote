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
        <v-btn color="primary" @click="toStorage">
          <v-icon left>
            mdi-arrow-left-circle
          </v-icon>
          내 파일함</v-btn>
        <input placeholder="제목을 입력하세요" type="text"
               style="width: 40%; background-color:white;"/>
      </v-row>
      <v-row>
        <video class="video-frame" controls autoplay muted crossorigin="anonymous"
               :src="`${videoUrl}#t=0.5`"
               id="videoOrigin" width="100%" height="500"
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
        <v-btn color="primary">test3</v-btn>
      </v-row>
      <v-row>
        <v-btn>노트</v-btn>
        <v-dialog
          transition="dialog-bottom-transition"
          max-width="600"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              v-bind="attrs"
              v-on="on"
            >코멘트</v-btn>
          </template>
          <template v-slot:default="dialog">
            <v-card>
              <v-toolbar
                color="primary"
                dark
              >코멘트</v-toolbar>
              <div id="commentArea">
                <div class="owner">
                  <span>{{ comments.length }}개의 comment</span>
                  <div class="ownerAvatar">
                    <a class="username" href="#"><img :src="creator.avatar" alt=""></a>
                  </div>
                  <div class="ownerName">
                    <span>{{ creator.user }}</span>
                  </div>
                </div>
                <div class="custom-scrollbar">
                  <div class="comment" v-for="comment of comments">
                    <div class="avatar">
                      <a class="username" href="#"><img :src="comment.data().avatar" alt=""></a>
                    </div>
                    <div class="user">
                      {{ comment.data().user }}
                    </div>
                    <div class="texts">
                      {{ comment.data().texts }}
                    </div>
                    <div class="time">
                      {{timestampToDate(comment.data().timestamp)}}
                    </div>
                    <button class="inlineBtn">
                      <v-icon right @click="removeComment(comment)">mdi-close-box</v-icon>
                    </button>
                  </div>
                </div>
                <comments
                  :current_user="current_user"
                  @submit-comment="submitComment">
                </comments>
              </div>
              <v-card-actions class="justify-end">
                <v-btn
                  text
                  @click="dialog.value = false"
                >Close</v-btn>
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog>
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
import Drawing from "/components/Drawing";
import Comments from '/pages/comments';

export default {
  components: {
    Drawing,
    Comments,
  },
  data() {
    return {
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
      commentsArr: [],
      // avatarArr: [
      //   'http://via.placeholder.com/100x100/a74848',
      //   'http://via.placeholder.com/100x100/2d58a7',
      //   'http://via.placeholder.com/100x100/36846e'
      // ]
      items: ["8", "20"],
      selectedFont: null,
      fileId:this.$route.params.id,
      fileName:'',
      video:'',
      videoUrl:'',
    };
  },
  mounted() {
    this.canvas = document.querySelector("#videoCanvas");
    this.context = this.canvas.getContext('2d');
    this.context.strokeStyle = '#001dff';
    this.context.fillStyle = '#001dff';
    this.context.lineWidth = 3.5;
    this.queryVideo();
    this.viewData();
  },
  methods: {
    async queryVideo() {
      await this.$fire.firestore
        .collection(`users/${this.$fire.auth.currentUser.uid}/files`).doc(this.fileId).get()
        .then((doc) =>{
          const self = this;
          this.fileName = doc.data().name;
          this.video = doc.data().path ? self.$fire.storage.ref(doc.data().path).getDownloadURL() : '';
        });

      // video url
      this.video.then(url => this.videoUrl = url);
      // console.log(this.videoUrl);
    },
    toStorage(){
      this.$router.push("/myfiles");
    },
    async viewData(){
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
    async onSaveNote() {
      this.$fire.firestore.doc(`users/${this.$fire.auth.currentUser.uid}`).
      set({name: this.name}, {merge: true}).
      then(para => {
        console.log('Save test : '+para);
      });

      this.noteTexts = document.getElementById('content-editor');
      const self = this;
      console.log(this.noteTexts.innerText);
      await self.$fire.firestore.collection(`users/${self.$fire.auth.currentUser.uid}/notes`).add({
        text: self.noteTexts.innerText,
        timestamp: self.$fireModule.firestore.FieldValue.serverTimestamp()
      });
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
      this.noteTexts.innerHTML = "";
    },
    async removeComment(comment) {
      console.log('comment: ', comment.id);
      await this.$fire.firestore.doc(`users/${this.$fire.auth.currentUser.uid}/comments/${comment.id}`).delete();
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
        user: self.current_user.user,
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
    drawVideo: function () {
      this.video = document.querySelector("#videoOrigin");
      this.canvas = document.querySelector("#videoCanvas");
      this.context = this.canvas.getContext('2d');
      this.drawcanvas = document.querySelector("#drawing-canvas");
      this.drawcontext = this.canvas.getContext('2d');

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

      imgNode.addEventListener("click",this.popupCanvas);

      document.getElementById('content-editor').appendChild(imgNode);
      //document.getElementsByClassName("ProseMirror")[0].appendChild(imgNode);
    },
    textEdit: function (command) {
      document.execCommand(command);
    },
    choiceFile: function () {
      document.getElementById("fileupload").click();
    },
    timestampToDate: function(timestamp) {
      try {
        let date = timestamp.toDate();
        let now = new Date();
        this.currentDate = new Date(now.getFullYear(), now.getMonth()+1, now.getDate(), now.getHours(), now.getMinutes());
        this.stampDate = new Date(date.getFullYear(), date.getMonth()+1, date.getDate(), date.getHours(), date.getMinutes());
        this.calMsec = this.currentDate.getTime() - this.stampDate.getTime();
        this.calMin = parseInt(this.calMsec / 1000 / 60);
        this.calHour = parseInt(this.calMsec / 1000 / 60 / 60);
        if(this.calHour >= 1) return (this.calHour + '시간 전');
        else return (this.calMin + '분 전');
      }
      catch (e) {
        console.log(e);
      }
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
.edit-toolbar{
  margin-bottom: 10px;
  margin-top : 10px;
}
#commentArea {
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
.comment {
  display: flex;
  padding: 5px 10px;
  margin-bottom: 10px;
  align-items: center;
  color: #333;
  background-color: #F2F2F2;
  border-radius: 30px;
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
}
.comment .username {
  align-self: flex-start;
  margin-top: 5px;
}
.comment .avatar > a > img {
  width: 40px;
  height: 40px;
  border-radius: 100%;
  align-self: start;
}
.comment .user{
  text-align: left;
  margin-left: 5px;
}
.comment .texts {
  text-align: left;
  margin-left: 15px;
}
.comment .time {
  text-align: left;
  margin-left: 20px;
}
.comment .inlineBtn {
  display: inline;
}
.custom-scrollbar{
  max-height: 250px;
  overflow-y: auto;
  padding-right: 10px;
}
.custom-scrollbar::-webkit-scrollbar-track
{
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  -moz-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  border-radius: 10px;
  background-color: #fff;
}
.custom-scrollbar::-webkit-scrollbar
{
  width: 8px;
  background-color: #fff;
}
.custom-scrollbar::-webkit-scrollbar-thumb
{
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
  -moz-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
  box-shadow: inset 0 0 6px rgba(0,0,0,.3);
  background-color: #555;
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
