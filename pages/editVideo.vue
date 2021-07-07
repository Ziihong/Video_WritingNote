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
      <v-spacer/>
      <v-btn icon id="newBtn" @click.stop="isBookmarking ? openDialog() : showBookmark()">
        <v-icon>mdi-{{`${isBookmarking? 'book-edit' : 'star'}`}}</v-icon>
      </v-btn>
      <v-btn icon id="pecilBtn" @click="isPencil=!isPencil">
        <v-icon>mdi-{{`${isPencil? 'pencil' : 'pencil-off'}`}}</v-icon>
      </v-btn>
    </v-app-bar>

    <v-row no-gutters>
        <v-col cols="12" md="8">
            <v-row id="videoArea" no-gutters>
              <div
                v-if="isBookmarking"
                @click="setNote($event)"
                class="clickPlane">
                <canvas id="clickPlane"></canvas>
              </div>
              <v-col>
                <video
                  id="currentVideo"
                  style="margin-left: 0px; padding-left: 0px;"
                  width="100%"
                  controls
                  muted
                  src="/video/Cat-66004.mp4"></video>
              </v-col>
            </v-row>

            <v-divider></v-divider>
            <v-row id="bookmarkArea" no-gutters>
              <v-col>
                <p class="text-center"
                   style="margin-bottom: 12px; margin-top: 12px;">
                  <v-icon>mdi-star</v-icon>Bookmarks</p>
                <v-divider></v-divider>
                <v-list
                  style="max-height: 140px; min-height: 140px"
                  class="overflow-y-auto">
                  <v-list-item
                    v-for="(item, i) in items"
                    :key="i"
                    @click="jumpTime(item)"
                    router
                    exact
                  >
                    <v-list-item-action>
                      <v-icon>{{ i+1 }}</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title v-text="item.title" />
                    </v-list-item-content>
                    <v-btn icon id="editbookmarkTitle" @click="">
                      <v-icon>mdi-square-edit-outline</v-icon></v-btn>
                    <v-btn icon id="deletebookmarkTitle" style="color: red"
                           @click="deleteBookmark($event)">
                      <v-icon>mdi-minus</v-icon></v-btn>
                  </v-list-item>
                </v-list>
              </v-col>
            </v-row>
        </v-col>
        <v-col id="docArea">
          <TextEditor/>
        </v-col>
      </v-row>

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
            Cancel
          </v-btn>
          <v-btn
            id ="addBtn"
            color="primary"
            @click="setbookmarkTitle();addBookmark()">
            Add
          </v-btn>
        </v-card-actions>
      </v-dialog>
  </v-row>
</template>

<script>

import TextEditor from "@/components/TextEditor"
import { Editor, EditorContent } from '@tiptap/vue-2'
import StarterKit from '@tiptap/starter-kit'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Image from '@tiptap/extension-image'
import Dropcursor from '@tiptap/extension-dropcursor'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'

class Bookmark{
  constructor(index, inputTitle, inputTime, noteComments){
    this.icon=index+1;
    this.title=inputTitle;
    this.time=inputTime;
    this.notecomments=noteComments;
  }
}
class Note{
  constructor(x, y, comment) {
    this.xcomponent = x;
    this.ycomponent = y;
    this.comment = comment
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
      title: 'Video Comment',
      dialog: false,
      isBookmarking: false,
      itemNow: null,
      isPencil: false,
      currentTime: null,
      currentVideo: null,
      bookmarkTitle: null,
      prenote:null,
      items: [
        {
          title: 'Start',
          time: 0,
          notecomments: [{xcomponent: 60 , ycomponent: 300, comment: 'This is the start of video.'}]
        },
        {
          title: 'Bookmark',
          time: 3,
          notecomments: []
        },
        {
          title: 'Bookmark',
          time: 5,
          notecomments: []
        },
        {
          title: 'Bookmark',
          time: 9,
          notecomments: [{xcomponent: 60 , ycomponent: 300, comment: 'This is the end of video.'}]
        }
      ],
    }
  },
  mounted() {
    this.editor = new Editor({
      extensions: [
        StarterKit,
        Document,
        Paragraph,
        Text,
        Image,
        Dropcursor,
        TextAlign,
        Highlight,
      ],
    })
  },
  beforeDestroy() {
    this.editor.destroy()
  },
  methods:{
    //bookmark methods
    jumpTime(item){ //method for time jump in video
      this.currentVideo = document.getElementById('currentVideo');
      this.currentVideo.currentTime = item.time;
      this.currentVideo.pause();
      this.showBookmark(item);
    },
    openDialog(){ //method for opening bookmark title dialog
      if(this.itemNow == null){
        this.dialog = true;
      }
      else{
        this.addBookmark();
      }
      //document.getElementById('bookmarkName').value = this.currentTime;
    },
    setbookmarkTitle(){ //method for setting bookmark name
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

        let item= new Bookmark(this.items.length,this.bookmarkTitle, this.currentTime, notes);
        this.items.push(item);

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
      }
      this.itemNow=null;
      this.isBookmarking= false;
    },
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
    deleteBookmark(event){
      console.log(event);
    },
    //notes methods
    createNote(x, y, comment){ //method for creating notes
      let note=document.createElement('textarea');
      let noteWrap=document.createElement('div');
      let deleteButton = document.createElement('button');

      noteWrap.setAttribute('class', 'noteWrap');
      note.setAttribute('class', 'note');
      deleteButton.setAttribute('class', 'noteDeleteButton');

      note.value = comment
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
    deleteNote(event){ // method for deleting a note
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
    goFront(event){ // method for moving note to front
      let target = event.path[1];
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
    setNote(event){ // method for getting the click point and make a note
      let x= event.offsetY;
      let y= event.offsetX;
      //console.log( `Coordinate:(${x},${y})`);

      this.createNote(x, y, 'Some notes...')
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
  border-radius:50%;
  position: relative;
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
  padding-left: 1px;
}
</style>
