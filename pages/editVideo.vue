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
      <v-toolbar-title class="text-center" v-text="title" />
      <v-spacer />
      <v-btn icon id="newBtn" @click.stop="isBookmarking ? addBookmark(): showBookmark()">
        <v-icon>mdi-{{`${isBookmarking? 'file' : 'star'}`}}</v-icon>
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
                  src="/video/Cat-66004.mp4"
                  @click="isBookmarking? openDialog: null"></video>
              </v-col>
            </v-row>

            <v-divider></v-divider>
            <v-row id="bookmarkArea" no-gutters>
              <v-col>
                <p class="text-center" style="margin-bottom: 12px; margin-top: 12px;"><v-icon>mdi-star</v-icon>Bookmarks</p>
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
                      <v-icon>{{ item.icon }}</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title v-text="item.title" />
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-col>
            </v-row>
        </v-col>
        <v-col>
          <TextEditor/>
        </v-col>
      </v-row>

    <v-dialog v-model="dialog" width="500" v-if="dialog">
        <v-card-text class="text-center">
          <em><small>&mdash; Write anything</small></em>
          <hr class="my-3">
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            id ="addBtn"
            color="primary"
            to="/editVideo">
            BTN
          </v-btn>
        </v-card-actions>
      </v-dialog>
  </v-row>
</template>

<script>

import TextEditor from "@/components/TextEditor";

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
      items: [
        {
          icon: 1,
          title: 'Start',
          time: 0,
          notecomments: [{xcomponent: 60 , ycomponent: 300, comment: 'This is the start of video.'}]
        },
        {
          icon: 2,
          title: 'Bookmark',
          time: 3,
          notecomments: []
        },
        {
          icon: 3,
          title: 'Bookmark',
          time: 5,
          notecomments: []
        },
        {
          icon: 4,
          title: 'Bookmark',
          time: 9,
          notecomments: []
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
    jumpTime(item){
      this.currentVideo = document.getElementById('currentVideo');
      this.currentVideo.currentTime = item.time;
      this.currentVideo.pause();
      this.showBookmark(item);
    },
    addBookmark(){
      this.currentVideo = document.getElementById('currentVideo');
      this.currentTime = this.currentVideo.currentTime;
      const videoArea = document.getElementById('videoArea');
      const notes=[];

      if(this.itemNow == null){
        // removing & saving floating notes
        for(let i = 0; i<videoArea.children.length;){
          if(videoArea.children[i].className === 'note'){
            // save note object in array
            notes.push(new Note(videoArea.children[i].style.top.replace('px', ''),
              videoArea.children[i].style.left.replace('px', ''),
              videoArea.children[i].value));
            // remove notes
            videoArea.removeChild(videoArea.children[i]);
          }
          else{
            i++;
          }
        } // end remove

        let item= new Bookmark(this.items.length,`${this.currentTime}`, this.currentTime, notes);
        this.items.push(item);

        //console.log(item);
      }
      else{
        for(let i = 0; i<videoArea.children.length;){
          if(videoArea.children[i].className === 'note'){
            // save note object in array
            notes.push(new Note(videoArea.children[i].style.top.replace('px', ''),
              videoArea.children[i].style.left.replace('px', ''),
              videoArea.children[i].value));
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
      let noteTemp =null;
      //console.log(item);
      if(item != null){
        this.itemNow = item;
        let length = item.notecomments.length;
        const videoArea = document.getElementById('videoArea');
        for(let i =0; i< length; i++){
          noteTemp = item.notecomments[i];
          this.createNote(noteTemp.xcomponent,
                          noteTemp.ycomponent,
                          noteTemp.comment);
        }
      }
    },
    createNote(x, y, comment){
      let note=document.createElement('textarea');
      note.setAttribute('class', 'note');
      note.style.top=`${x}px`;note.style.left=`${y}px`;
      document.getElementById('videoArea').appendChild(note);
      note.value = comment
      note.onclick=this.goFront;
      if(this.prenote){
        this.prenote.style.zIndex='1';
      }
      this.prenote = note;
    },
    goFront(event){
      console.log(event);
      let target = event.target;
      if(this.prenote != target){
        this.prenote.style.zIndex="1";
        target.style.zIndex="2";
        this.prenote = target;
      }
    },
    setNote(event){
      let x= event.offsetY;
      let y= event.offsetX;
      //console.log( `Coordinate:(${x},${y})`);

      this.createNote(x, y, 'Some notes...')
    },
    setCanvas(){ // need to look at this once more, I set canvas width and height offset, not following that of video
      const canvas = document.getElementById('clickPlane');
      const vid = document.getElementById('currentVideo');
      const vidStyle = vid.getBoundingClientRect();
      console.log(canvas);
      if(canvas != null){
        canvas.style.width = vidStyle.width+"px"
        canvas.style.height = vidStyle.height+"px"
      }

    },
    openDialog(){ //?
      this.dialog=true;
      this.currentVideo = document.getElementById('currentVideo');
      this.currentVideo.pause();
    },
  },
}
</script>

<style>
.note{
  background-color: khaki;
  opacity: 40%;
  border: 1px solid black;
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
</style>
