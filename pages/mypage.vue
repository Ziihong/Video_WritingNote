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
        <channel v-on:join-event="joinReceive" v-on:leave-event="leaveReceive"></channel>
        <!--        <input placeholder="제목을 입력하세요" type="text"-->
        <!--               style="width: 40%; background-color:white;"/>-->
      </v-row>
      <v-row>
<!--        <video class="video-frame" controls autoplay muted-->
<!--               src="/hd.mp4" id="videoOrigin" width="100%" height="500">-->
<!--          브라우저가 비디오 플레이를 지원하지 않습니다-->
<!--        </video>-->
<!--        <video id="videoOrigin" autoplay width="100%" height="500"></video>-->
        <share></share>
      </v-row>
      <v-row class="participant-wrap">
        <div v-if="isChannel">{{ authUser.nickname }}</div>
        <v-btn @click="copyEncryptUrl" color="primary" right> 링크공유</v-btn>
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
        <v-btn @click="isChat=false;">노트</v-btn>
        <v-btn @click="isChat=true;">채팅</v-btn>
        <Comment
          :creator="creator"
          :comments="comments"
          :current_user="current_user">
        </Comment>
      </v-row>
      <v-col class="note-wrap" v-if="!isChat">
      <v-row><h1>노트 제목</h1></v-row>
      <div class="edit-toolbar">
        <Toolbar></Toolbar>
      </div>
      <v-row>
        <div id="content-editor" contenteditable="true">
          <template v-for="note of notes">
            {{testFunc(note.data().text)}}
          </template>
        </div>
      </v-row>
      <v-row>
        <v-btn color="primary" @click.stop="drawVideo">캡쳐</v-btn>
        <v-btn color="primary" @click.stop="onSaveNote">저장</v-btn>
<!--        <v-btn color="primary" @click="makeMarker">Mark</v-btn>-->
        <v-btn color="primary" @click="saveToPdf">PDF</v-btn>
        <v-btn @click="testF">aa</v-btn>
<!--        <v-btn color="primary">공유하기</v-btn>-->
      </v-row>
      </v-col>
      <v-col v-else>
        chatting
      </v-col>
    </v-col>
  </v-row>
</template>

<script>
import jsPDF from 'jspdf'
import html2canvas from "html2canvas";
import Drawing from "../components/Drawing";
import Comment from '../components/Comment';
import Toolbar from "../components/Toolbar";
import share from "/pages/share";
import Channel from '../components/Channel';
import apiVersions from '../static/api';
import b64 from '../static/b64';
import {mapGetters, mapState} from "vuex";

export default {
  components: {
    Drawing,
    Comment,
    Toolbar,
    share,
    Channel,
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
      isChat: false,
      isStorage:true,
      isChannel: false,
    };
  },
  computed: {
    ...mapState({
      authUser: state => state.authUser,
    }),
    ...mapGetters({
      isLoggedIn: 'isLoggedIn',
    }),
  },
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
    joinReceive() {
      this.isChannel = true;
    },
    leaveReceive() {
      this.isChannel = false;
    },
    testFunc(html) {
      try {
        let div = document.getElementById("content-editor");
        let newStr = "<div>" + html + "</div>";
        // div.innerHTML = newStr;
        let newdiv = document.createElement('div');
        newdiv.innerHTML = html;
        div.appendChild(newdiv);
        // div.insertAdjacentHTML( 'beforeend', newStr );
        // event.stopPropagation();
      } catch (e) {
        console.log(e);
      }
    },
    testF(){
      let newdiv = document.createElement('div');
      let newimg = document.createElement('img');
      newimg.src="v.png";
      document.getElementById("content-editor").appendChild(newimg);
    },
    async onSaveNote() {
      try {
        let replacement = document.getElementById('content-editor').innerHTML.replace(/<div>/g, "`");
        let everyReplace = replacement.replace(/<\/div>/g, "`");
        let strSplit = everyReplace.split("`" || "``");
        const textArr = [];
        const self = this;

        for(let i=0; i<strSplit.length; i++){
          if(strSplit[i]!==""){
            textArr.push(strSplit[i]);
          }
        }
        //delete all that has saved before
        let i = this.notes.length;
        while(i !== 0){
          await this.$fire.firestore.doc(`users/${this.$fire.auth.currentUser.uid}/notes/${this.notes[0].id}`).delete();
          i--;
        }
        console.log(textArr);
        for(const i of textArr){
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
      } catch (e) {
        console.log(e);
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

      // this.canvasImgsrc = this.canvas.toDataURL();
      imgNode.width = this.canvas.width / 4;
      imgNode.height = this.canvas.height / 4;

      imgNode.addEventListener("click", this.popupCanvas);

      document.getElementById('content-editor').appendChild(imgNode);
      // this.isCanvasOn = false;
      //document.getElementsByClassName("ProseMirror")[0].appendChild(imgNode);
    },
    choiceFile: function () {
      document.getElementById("fileupload").click();
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
        let position = 0;
        let pageHeight = imgWidth * 1.414;
        let heightLeft =  imgHeight;
        let margin = 10;
        doc.addImage(imgData, 'PNG', -6, position, imgWidth, imgHeight);

        heightLeft -= pageHeight;
        while(heightLeft >= 20){
         position = heightLeft - imgHeight;
         doc.addPage();
         doc.addImage(imgData, 'PNG', -6, position, imgWidth, imgHeight);
         heightLeft -= pageHeight;
        }
        doc.save('sample.pdf');
      });
    },
    popupCanvas: function (event) {
      this.video = document.querySelector("#videoOrigin");

      // this.canvasImgsrc = event.target.src;
      // this.isCanvasOn = true;
      this.$refs.drawingPopup.drawingImage(event.target.src, this.video.clientWidth, this.video.clientHeight);
    },
    async generateFragment(url, passwd) {
      const encrypted = await apiVersions["0.0.1"].encrypt(url, passwd);
      const output = {
        v: "0.0.1",
        e: b64.binaryToBase64(new Uint8Array(encrypted))
      }
      // Return the base64-encoded output
      return b64.encode(JSON.stringify(output));
    },
    async copyEncryptUrl() {
      // Get password value
      const password = prompt("Set password for link");
      // Get current page url
      const url = window.document.location.href;
      // Copy url to clipboard
      let textarea = document.createElement("textarea");
      const encrypted = await this.generateFragment(url, password);
      const output = `http://localhost:3000/alertPage/#${encrypted}`;

      if(password == null) return;
      document.body.appendChild(textarea);
      textarea.value = output;
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      alert("URL이 복사되었습니다.");

      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    },
  }
}
</script>

<style scoped>
video {
  margin: 0 0 20px 0;
  width: 100%;
  background: #222;
}

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

.note-wrap{
  position:relative;
  /*background-color: #41b883;*/
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
