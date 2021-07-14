<template>
  <v-row>
    <v-col cols="8">
      <v-row class="btn-wrap">
        <v-btn color="primary">
          <v-icon left>mdi-arrow-left-circle</v-icon>
          내 파일함
        </v-btn>
        <v-btn color="primary">
          <v-icon left>mdi-monitor</v-icon>
          화면공유
        </v-btn>
        <v-btn color="primary">
          <v-icon left>mdi-movie</v-icon>
          로컬공유
        </v-btn>
        <!--        <input placeholder="제목을 입력하세요" type="text"-->
        <!--               style="width: 40%; background-color:white;"/>-->
      </v-row>
      <v-row>
        <video class="video-frame" controls autoplay muted
               src="/hd.mp4" id="videoOrigin" width="100%" height="500">
          브라우저가 비디오 플레이를 지원하지 않습니다
        </video>
      </v-row>
      <v-row class="participant-wrap">
        <div>참가자들</div>
        <v-btn color="primary" right> 링크공유</v-btn>
      </v-row>
      <!--      <v-row id="draw">-->
      <!--        <v-stepper v-model="el" id="markStepper">-->
      <!--          <v-stepper-header>-->
      <!--            <v-stepper-step v-for="mark of marks" v-bind:key="mark.timeline"-->
      <!--                            :step="mark.data().time.toFixed(1)">-->
      <!--              <v-btn @click="goToMarkTime(mark.data().time)">-->
      <!--                <img src="/v.png" width="20" height="20">-->
      <!--                <v-icon right @click="removeMark(mark)">mdi-close-box</v-icon>-->
      <!--              </v-btn>-->
      <!--            </v-stepper-step>-->
      <!--          </v-stepper-header>-->
      <!--        </v-stepper>-->
      <!--      </v-row>-->
    </v-col>
    <v-col cols="4" class="note-box">
      <canvas id="videoCanvas" ref="textarea" class="hidden"></canvas>
      <Drawing :isCanvasViewed="this.isCanvasOn"
               :imageSrc="this.canvasImgsrc"
               ref="drawingPopup"></Drawing>
      <v-row class="btn-wrap">
        <v-btn>노트</v-btn>
        <v-btn>채팅</v-btn>
        <Comment
          :creator="creator"
          :comments="comments"
          :current_user="current_user">
        </Comment>
      </v-row>
      <v-row><h1>노트 제목</h1></v-row>
      <div class="edit-toolbar">
        <Toolbar></Toolbar>
      </div>
      <v-row>
        <div id="content-editor" contenteditable="true">
          <template v-for="note of notes">
            <div>
              {{ note.data().text }}
            </div>
          </template>
        </div>
      </v-row>
      <v-row>
        <v-btn color="primary" @click="drawVideo">캡쳐</v-btn>
        <v-btn color="primary" @click="onSaveNote">저장</v-btn>
<!--        <v-btn color="primary" @click="makeMarker">Mark</v-btn>-->
        <v-btn color="primary" @click="saveToPdf">PDF</v-btn>
<!--        <v-btn color="primary">공유하기</v-btn>-->
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import jsPDF from 'jspdf'
import html2canvas from "html2canvas";
import Drawing from "../components/Drawing";
import Comment from '../components/Comment';
import Toolbar from "../components/Toolbar";

export default {
  components: {
    Drawing,
    Comment,
    Toolbar,
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
      imageClicked: false,
      isCanvasOn: false,
      clickedImage: '',
      canvasImgsrc: '',
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
  computed: {},
  mounted() {
    if (!this.$fire.auth.currentUser)
      return;
    this.$fire.firestore.doc(`users/${this.$fire.auth.currentUser.uid}`).get().then(docSnap => {
      if (docSnap.exists) {
        this.name = docSnap.data().name;
        this.description = docSnap.data().description;
      } else {
        console.log('');
      }
    });

    this.$fire.firestore.doc(`users/${this.$fire.auth.currentUser.uid}`).collection('comments').orderBy('timestamp').onSnapshot((async querySnapshot => {
      this.comments = querySnapshot.docs;
      const self = this;
      this.commentUrls = await Promise.all(this.comments.map(comment => comment.data().path ? self.$fire.storage.ref(comment.data().path).getDownloadURL() : ''));
    }));

    this.$fire.firestore.doc(`users/${this.$fire.auth.currentUser.uid}`).collection('notes').orderBy('timestamp').onSnapshot((async querySnapshot => {
      this.notes = querySnapshot.docs;
      const self = this;
      this.noteUrls = await Promise.all(this.notes.map(note => note.data().path ? self.$fire.storage.ref(note.data().path).getDownloadURL() : ''));
    }));

    this.$fire.firestore.doc(`users/${this.$fire.auth.currentUser.uid}`).collection('marks').orderBy('timestamp').onSnapshot((async querySnapshot => {
      this.marks = querySnapshot.docs;
      const self = this;
      this.markUrls = await Promise.all(this.marks.map(mark => mark.data().path ? self.$fire.storage.ref(mark.data().path).getDownloadURL() : ''));
    }));
  },
  methods: {
    async onSaveNote() {
      const self = this;
      const textArr = [];
      this.noteTexts = document.getElementById('content-editor').getElementsByTagName('div');
      //add contentEditable div text because this is not in div tag
      let strSplit = document.getElementById('content-editor').innerHTML.split('<div');

      if (strSplit[0][0] !== '<') {
        textArr.push(strSplit[0]);
      }
      for (let i = 0; i < self.noteTexts.length; i++) {
        textArr.push(self.noteTexts[i].innerText);
      }
      //delete all that has saved before
      let i = this.notes.length;
      while (i !== 0) {
        await this.$fire.firestore.doc(`users/${this.$fire.auth.currentUser.uid}/notes/${this.notes[0].id}`).delete();
        i--;
      }
      for (const i of textArr) {
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
          this.notes = querySnapshot.docs;
          const self = this;
          this.noteUrls = await Promise.all(this.notes.map(note => note.data().path ? self.$fire.storage.ref(note.data().path).getDownloadURL() : ''));
        }));
      document.getElementById('content-editor').innerHTML = "";
    },
    async removeMark(mark) {
      await this.$fire.firestore.doc(`users/${this.$fire.auth.currentUser.uid}/marks/${mark.id}`).delete();
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
      imgNode.width = this.canvas.width / 4;
      imgNode.height = this.canvas.height / 4;

      imgNode.addEventListener("click", this.popupCanvas);

      document.getElementById('content-editor').appendChild(imgNode);
      this.isCanvasOn = false;
      //document.getElementsByClassName("ProseMirror")[0].appendChild(imgNode);
    },
    choiceFile: function () {
      document.getElementById("fileupload").click();
    },
    async makeMarker() {
      const originVideo = document.querySelector("#videoOrigin");
      const self = this;

      await self.$fire.firestore.collection(`users/${self.$fire.auth.currentUser.uid}/marks`).add({
        time: originVideo.currentTime,
        timestamp: self.$fireModule.firestore.FieldValue.serverTimestamp()
      });

      this.marks = [];
      const fileStorageRef = this.$fire.firestore.collection(`users/${this.$fire.auth.currentUser.uid}/marks`);
      fileStorageRef.orderBy('timestamp')
        .onSnapshot((async querySnapshot => {
          this.marks = querySnapshot.docs;
          const self = this;
          this.markUrls = await Promise.all(this.marks.map(mark => mark.data().path ? self.$fire.storage.ref(mark.data().path).getDownloadURL() : ''));
        }));
    },
    goToMarkTime: function (time) {
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
      }).then(function (canvas) {
        let imgData = canvas.toDataURL('image/png');
        let imgWidth = 210;
        let imgHeight = canvas.height * imgWidth / canvas.width;
        let doc = new jsPDF('p', 'mm');
        let position = -1;

        doc.addImage(imgData, 'PNG', -6, position, imgWidth, imgHeight);
        doc.save('sample.pdf');
      });
    },
    popupCanvas: function (event) {
      this.video = document.querySelector("#videoOrigin");

      this.canvasImgsrc = event.target.src;
      this.isCanvasOn = true;
      this.$refs.drawingPopup.drawingImage(event.target.src, this.video.clientWidth, this.video.clientHeight);
    },
  }
}
</script>

<style scoped>
.btn-wrap {
  margin-top: 15px;
  margin-bottom: 20px;
}

.participant-wrap {
  margin-top: 30px;
  border: cornflowerblue 1px solid;
}

.note-box {
  height: 600px;
}

.video-frame {
  max-width: 100%;
  height: auto;
}

#content-editor {
  position: relative;
  width: 100%;
  height: 340px;
  max-height: 600px;
  padding: 10px;
  border: 1px solid;
  overflow-y: auto;
  font-family: "Nanum Square";
}

#markStepper {
  /*width: 100%;*/
}

.hidden {
  display: none;
}
</style>
