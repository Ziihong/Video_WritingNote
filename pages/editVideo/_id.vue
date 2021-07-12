<template>
  <v-row>
    <v-app-bar
      fixed
      app
    >
      <v-btn
        to="/">
        <v-icon left>
          mdi-home
        </v-icon>
        Home
      </v-btn>
      <v-toolbar-title class="text-center" v-text="title" style="padding-left: 2%; padding-right: 2%"/>
      <v-btn v-if="isBookmarking" @click="removeNotesAll()">clear all</v-btn>
      <v-btn v-if="isBookmarking" @click="removeNotesAll(), isBookmarking=false">cancel</v-btn>
      <v-spacer/>
      <v-btn icon id="newBtn" @click.stop="isBookmarking ? openDialog() : showBookmark()">
        <v-icon>mdi-{{`${isBookmarking? 'book-edit' : 'star'}`}}</v-icon>
      </v-btn>
      <v-btn icon id="pecilBtn" @click="isPencil=!isPencil">
        <v-icon>mdi-{{`${isPencil? 'pencil' : 'pencil-off'}`}}</v-icon>
      </v-btn>
    </v-app-bar>

    <!--table과 th에 width 속성을 지정 => resize bar(.columns-resize-bar)정상 작동 x-->
    <table class="pageTable" style="width: 100%">
      <thead v-columns-resizable>
      <tr>
        <th id="videoArea" style="width: 70%">
          <div
            v-if="isBookmarking"
            @click="setNote($event)"
            class="clickPlane">
            <canvas id="clickPlane"></canvas>
          </div>
            <video
              id="currentVideo"
              style="margin-left: 0px; padding-left: 0px; width: 100%"
              controls
              muted
              src="/video/Cat-66004.mp4">
            </video>
        </th>
        <th style="width: 30%; height: auto" rowspan="2" id="docArea">
          <TextEditor/>
        </th>
      </tr>
      <tr>
        <th id="bookmarkArea" style="background-color: lightcyan">
            <p class="text-center"
               style="margin-bottom: 12px; margin-top: 12px;">
              <v-icon>mdi-star</v-icon>Bookmarks</p>
            <v-list
              style="max-height: 140px; min-height: 140px; padding-top: 0px"
              class="overflow-y-auto">
              <p v-if="items.length == 0"
                 style="text-align: center;font-size: 25px; color: lightgray">No Bookmarks! Add one.</p>
              <v-list-item
                v-for="(item, i) in items"
                :key="i"
                @click="jumpTime(item)"
                style="border-bottom: 1px solid lightgray"
                router
                exact
              >
                <v-list-item-action>
                  <v-icon>{{ i+1 }}</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title v-if="clickedIndex != i" v-text="item.title"/>
                  <v-text-field v-else
                                placeholder ="Write your bookmark name."
                                v-model="item.title"
                                @click="$event.stopPropagation()"
                                v-click-outside="editbookmarkTitle"
                                style="margin: 0; padding: 0;"
                                hide-details=true
                  ></v-text-field>
                </v-list-item-content>
                <v-btn icon id="editbookmarkTitle" style="z-index: 1"
                       @click.stop= "isNamechange? null : editbookmarkTitle($event,i)">
                  <v-icon>mdi-square-edit-outline</v-icon></v-btn>
                <v-btn icon id="deletebookmarkTitle" style="color: red; z-index: 1"
                       @click.stop="deleteBookmark($event,i)">
                  <v-icon>mdi-minus</v-icon></v-btn>
              </v-list-item>
            </v-list>
          </th>
      </tr>
      </thead>
    </table>

    <v-dialog id="bookamarkNamedialog"
              v-model="dialog"
              v-if="dialog"
              max-width="400">
      <v-card-text class="text-center" style="background-color: lightgray">
        <em><small>&mdash; Bookmark Name</small></em>
        <hr class="my-3">
        <v-text-field id="bookmarkName" placeholder="default title is current time."></v-text-field>
      </v-card-text>
      <v-card-actions style="background-color: lightgray">
        <v-spacer></v-spacer>
        <v-btn
          id ="cancelBtn"
          color="primary"
          @click="dialog=false">
          Back
        </v-btn>
        <v-btn
          id ="addBtn"
          color="primary"
          @click="setbookmarkTitle();addBookmark()">
          Add
        </v-btn>
      </v-card-actions>
    </v-dialog>
  </div>
</template>

<script>
import { Editor ,EditorContent } from '@tiptap/vue-2'
import StarterKit from '@tiptap/starter-kit'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import CodeBlock from '@tiptap/extension-code-block'
import Image from '@tiptap/extension-image'
import Dropcursor from '@tiptap/extension-dropcursor'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import Underline from '@tiptap/extension-underline'
import VTooltip from 'v-tooltip'
import Typography from '@tiptap/extension-typography'


// import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
// // load all highlight.js languages
// import lowlight from 'lowlight'

import TextEditor from "@/components/TextEditor";

import Vue from 'vue'
import VueColumnsResizable from 'vue-columns-resizable'
Vue.use(VueColumnsResizable)

class Bookmark{
  constructor( inputTitle, inputTime, noteComments){
    this.title=inputTitle;
    this.time=inputTime;
    this.notecomments=noteComments;
  }
}

class Note{
  constructor(x, y, comment) {
    this.xcomponent = x;
    this.ycomponent = y;
    this.comment = comment;
  }
}

export default {
  layout:'empty',
  components: {
    EditorContent,
    TextEditor,
  },
  data () {
    return {
      id: this.$route.params.id,
      title: 'Video Comment',
      dialog: false,
      isBookmarking: false,
      isPencil: false,
      isNamechange: false,
      clickedIndex: null,
      itemNow: null,
      currentTime: null,
      currentVideo: null,
      bookmarkTitle: null,
      prenote: null,
      items: [
        {
          title: 'Start',
          time: 0,
          notecomments: [{xcomponent: 60 , ycomponent: 300, comment: 'This is the start of video.'},
            {xcomponent: 120 , ycomponent: 430, comment: 'Nothing special, just testing.'}]
        },
        {
          title: 'I wanna go home',
          time: 3,
          notecomments: [{xcomponent: 70 , ycomponent: 400, comment: 'I want to go on a vacation.'}]
        },
        {
          title: 'Cute Cute Cat',
          time: 5,
          notecomments: [{xcomponent: 100 , ycomponent: 370, comment: 'This cat is cute, though.'}]
        },
        {
          title: 'Video End',
          time: 9,
          notecomments: [{xcomponent: 60 , ycomponent: 300, comment: 'This is the end of video.'}]
        }
      ],
      fileUrl: '',
      fileUrls: [],
    }
  },

  mounted() {
    this.editor = new Editor({
      extensions: [
        StarterKit,
        Document,
        Paragraph,
        Text,
        CodeBlock,
        Image,
        Dropcursor,
        TextAlign,
        Highlight,
        Underline,
        Typography,
        VTooltip,
        TextAlign.configure({
          types: ['heading', 'paragraph'],
        }),
      ],
    })
    console.log(`users/${this.$fire.auth.currentUser.uid}/${this.id}`);
    const file = this.$fire.firestore.doc(`users/${this.$fire.auth.currentUser.uid}/files/${this.id}`);
    file.get().then((doc)=>{
      const self = this;
      console.log(self.$fire.storage.ref(doc.data().path).getDownloadURL());
      Promise.resolve(self.$fire.storage.ref(doc.data().path).getDownloadURL().then(result=>(this.fileUrl = result)));
    });
  },

  beforeDestroy() {
    this.editor.destroy()
  },

  methods:{
    //BOOKMARKS METHODS
    //method for time jump in video
    jumpTime(item){
      this.currentVideo = document.getElementById('currentVideo');
      this.currentVideo.currentTime = item.time;
      this.currentVideo.pause();
      this.showBookmark(item);
    },
    //method for opening bookmark title dialog
    openDialog(){
      if(this.itemNow == null){
        this.dialog = true;
      }
      else{
        this.addBookmark();
      }
    },
    //method for setting bookmark name
    setbookmarkTitle(){
      this.currentVideo = document.getElementById('currentVideo');
      this.currentTime = this.currentVideo.currentTime;
      if(document.getElementById('bookmarkName').value){
        this.bookmarkTitle = document.getElementById('bookmarkName').value;
      }
      else{
        this.bookmarkTitle = this.currentTime;
      }
      this.dialog = false;
    },
    // add notes to item list using constructor
    addBookmark(){
      const videoArea = document.getElementById('videoArea');
      const notes=[];

      if(this.itemNow == null) { // add new bookmark
        for(let i = 0; i<videoArea.children.length;){
          if(videoArea.children[i].className === 'noteWrap'){
            // save note object in array
            notes.push(new Note(videoArea.children[i].style.top.replace('px', ''),
              videoArea.children[i].style.left.replace('px', ''),
              videoArea.children[i].children[0].value));
            // remove notes
            videoArea.removeChild(videoArea.children[i]);
          }
          else{
            i++;
          }
        } // end remove

        let item= new Bookmark(this.bookmarkTitle, this.currentTime, notes);
        this.items.push(item)

        //console.log(item);
      }
      else{
        for(let i = 0; i<videoArea.children.length;){
          if(videoArea.children[i].className === 'noteWrap'){
            // save note object in array
            notes.push(new Note(videoArea.children[i].style.top.replace('px', ''),
              videoArea.children[i].style.left.replace('px', ''),
              videoArea.children[i].children[0].value));
            // remove notes
            videoArea.removeChild(videoArea.children[i]);
          }
          else{
            i++;
          }
        } // end remove
        this.itemNow.notecomments = notes;
        this.itemNow=null;
      }

      // comments change to JSON
      const commentsJSONString = JSON.stringify(this.items);
      console.log(commentsJSONString);

      this.isBookmarking= false;
    },

    // loading notes on screen based on items
    showBookmark(item){
      this.currentVideo = document.getElementById('currentVideo');
      this.currentVideo.pause();
      if(this.isBookmarking == true){
        this.addBookmark();
      }
      this.isBookmarking = true;
      if(item != null){ // show item comments on screen
        let noteTemp =null;
        this.itemNow = item;
        let length = item.notecomments.length;
        const videoArea = document.getElementById('videoArea');
        for(let i =0; i< length; i++){
          noteTemp = item.notecomments[i];
          this.createNote(noteTemp.xcomponent,
                          noteTemp.ycomponent,
                          noteTemp.comment);
        }
      } // show end
    },
    // method for opening bookmark name edit
    editbookmarkTitle(event, index){
      event.stopPropagation();
      if(this.isNamechange){
        this.clickedIndex= null;
        this.isNamechange = false;
      }
      else{
        this.clickedIndex= index;
        this.isNamechange = true;
      }
    },
    // method for deleting bookmark clicked
    deleteBookmark(event,index){
      event.stopPropagation();
      if(this.isBookmarking){ //check if deleting is currently open
        if(this.items[index] === this.itemNow){
          this.removeNotesAll();
          this.isBookmarking = false;
        }
      } // delete on screen end
      this.items.splice(index,1);

      // comments change to JSON
      const commentsJSONString = JSON.stringify(this.items);
      console.log(commentsJSONString);
    },

    //NOTES METHODS
    //method for creating notes
    createNote(x, y, comment){
      let note=document.createElement('textarea');
      let noteWrap=document.createElement('div');
      let deleteButton = document.createElement('button');

      noteWrap.setAttribute('class', 'noteWrap');
      note.setAttribute('class', 'note');
      deleteButton.setAttribute('class', 'v-btn v-btn--icon v-btn--round ' +
        'theme--light v-size--x-small noteDeleteButton');
      deleteButton.setAttribute('type', 'button');

      note.value = comment;
      note.placeholder = 'Write note here';
      note.onclick=this.goFront;
      deleteButton.innerText='❌';
      deleteButton.onclick = this.deleteNote;

      noteWrap.style.top=`${x}px`;noteWrap.style.left=`${y}px`;
      deleteButton.style.top='-10px';deleteButton.style.left='-10px';
      document.getElementById('videoArea').appendChild(noteWrap);
      noteWrap.appendChild(note);
      noteWrap.appendChild(deleteButton);

      if(this.prenote){
        this.prenote.children[1].style.visibility='hidden';
        this.prenote.style.zIndex='1';
        this.prenote.style.opacity='40%';
      }
      this.prenote = noteWrap;
    },
    // method for deleting a note
    deleteNote(event){
      let target = event.path[1];
      document.getElementById('videoArea').removeChild(target);
      let notes = document.getElementsByClassName('noteWrap');
      let next = notes[notes.length-1];
      if(next){
        next.children[1].style.visibility = "visible";
        next.style.zIndex="2";
        next.style.opacity="80%"
        this.prenote = next;
      }
    },
    // remove all the currently opened notes
    removeNotesAll() {
      const videoArea = document.getElementById('videoArea');
      for (let i = 0; i < videoArea.children.length;) {
        if (videoArea.children[i].className === 'noteWrap') {
          // remove notes
          videoArea.removeChild(videoArea.children[i]);
        } else {
          i++;
        }
      } // end remove
    },
    // method for moving note to front
    goFront(event){
      const target = event.path[1];
      if(this.prenote != target){
        this.prenote.children[1].style.visibility='hidden';
        this.prenote.style.zIndex="1";
        this.prenote.style.opacity="40%"
        target.children[1].style.visibility = "visible";
        target.style.zIndex="2";
        target.style.opacity="80%"
        this.prenote = target;
      }
    },
    // method for getting the click point and make a note
    setNote(event){
      let x= event.offsetY;
      let y= event.offsetX;
      //console.log( `Coordinate:(${x},${y})`);

      this.createNote(x, y, '')
    },

    setClickplane(){ // need to look at this once more, I set canvas width and height offset, not following that of video
      const canvas = document.getElementById('clickPlane');
      const vid = document.getElementById('currentVideo');
      const vidStyle = vid.getBoundingClientRect();
      console.log(canvas);
      if(canvas != null){
        canvas.style.width = vidStyle.width+"px"
        canvas.style.height = vidStyle.height+"px"
      }

    },
  },
}
</script>

<style>
.noteDeleteButton{
  background-color: white;
  position: relative;
  border: 1px solid black;
  text-align: center;
  z-index: 2;
}

.noteWrap{
  background-color: transparent;
  opacity: 80%;
  position: absolute;
  text-align: center;
  z-index: 1;
}

.note{
  background-color: khaki;
  opacity: 100%;
  position: absolute;
  text-align: center;
  z-index: 1;
}

.clickPlane{
  background-color: aquamarine;
  opacity: 20%;
  position: absolute;
  z-index: 1;
  width: 66.7%;
  height: 59%;
}

#docArea{
  padding-left: 1em;
  border-left: lightgrey;
}
</style>
