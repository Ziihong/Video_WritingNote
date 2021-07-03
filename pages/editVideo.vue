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
      <v-btn icon id="newBtn" @click.stop="isBookmarking ? isBookmarking=!isBookmarking : addBookmark()">
        <v-icon>mdi-star</v-icon>
      </v-btn>
      <v-btn icon id="pecilBtn" @click="isPencil=!isPencil">
        <v-icon>mdi-{{`${isPencil? 'pencil' : 'pencil-off'}`}}</v-icon>
      </v-btn>
    </v-app-bar>
      <v-row no-gutters>
        <v-col cols="12" md="7">
          <v-row no-gutters>
            <video
              id="currentVideo"
              style="margin-left: 0px;
              padding-left: 0px; z-index: 1"
              width="100%"
              controls
              muted
              src="/video/Cat-66004.mp4"
              @click="isBookmarking? openDialog: null">
            </video>
            <v-btn
              id="clickPlane"
              v-if="isBookmarking"
              @click="showCoords($event)"
              style="
              background-color: aquamarine;
              filter: alpha(opacity=70);
              opacity: 0.7;
              width: 58.3%;
              height: 67%;
              position: absolute;
              z-index: 2">
            </v-btn>
          </v-row>
          <v-divider></v-divider>
          <v-row no-gutters>
            <v-col>
              <p class="text-center" style="margin-bottom: 12px; margin-top: 12px"><v-icon>mdi-star</v-icon>Bookmarks</p>
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
        <v-col cols="12" md="5">
          <div>
            <div v-if="editor" class="editBar">
              <button @click="editor.chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }">bold</button>
              <button @click="editor.chain().focus().toggleItalic().run()" :class="{ 'is-active': editor.isActive('italic') }">italic</button>
              <button @click="editor.chain().focus().toggleStrike().run()" :class="{ 'is-active': editor.isActive('strike') }">strike</button>
              <button @click="editor.chain().focus().toggleCode().run()" :class="{ 'is-active': editor.isActive('code') }">code</button>
              <button @click="editor.chain().focus().unsetAllMarks().run()">clear marks</button>
              <button @click="editor.chain().focus().clearNodes().run()">clear nodes</button>
              <button @click="editor.chain().focus().setParagraph().run()" :class="{ 'is-active': editor.isActive('paragraph') }">paragraph</button>
              <button @click="editor.chain().focus().toggleHeading({ level: 1 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }">h1</button>
              <button @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }">h2</button>
              <button @click="editor.chain().focus().toggleHeading({ level: 3 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }">h3</button>
              <button @click="editor.chain().focus().toggleHeading({ level: 4 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }">h4</button>
              <button @click="editor.chain().focus().toggleHeading({ level: 5 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 5 }) }">h5</button>
              <button @click="editor.chain().focus().toggleHeading({ level: 6 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 6 }) }">h6</button>
              <button @click="editor.chain().focus().toggleBulletList().run()" :class="{ 'is-active': editor.isActive('bulletList') }">bullet list</button>
              <button @click="editor.chain().focus().toggleOrderedList().run()" :class="{ 'is-active': editor.isActive('orderedList') }">ordered list</button>
              <button @click="editor.chain().focus().toggleCodeBlock().run()" :class="{ 'is-active': editor.isActive('codeBlock') }">code block</button>
              <button @click="editor.chain().focus().toggleBlockquote().run()" :class="{ 'is-active': editor.isActive('blockquote') }">blockquote</button>
              <button @click="editor.chain().focus().setHorizontalRule().run()">horizontal rule</button>
              <button @click="editor.chain().focus().setHardBreak().run()">hard break</button>
              <button @click="editor.chain().focus().undo().run()">undo</button>
              <button @click="editor.chain().focus().redo().run()">redo</button>
              <button @click="editor.chain().focus().toggleHighlight().run()" :class="{ 'is-active': editor.isActive('highlight') }">highlight</button>
              <button @click="editor.chain().focus().setTextAlign('left').run()" :class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }">left</button>
              <button @click="editor.chain().focus().setTextAlign('center').run()" :class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }">center</button>
              <button @click="editor.chain().focus().setTextAlign('right').run()" :class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }">right</button>
              <button @click="editor.chain().focus().setTextAlign('justify').run()" :class="{ 'is-active': editor.isActive({ textAlign: 'justify' }) }">justify</button>
              <button id="addImage" @click="addImage()">addImage</button>
            </div>

            <editor-content :editor="editor" class="editDoc"/>
            <canvas id="screenCapture" style="border: 1px solid black; width: 100%;" hidden></canvas>
          </div>
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
            to="/editVideo"
          >
            BTN
          </v-btn>
        </v-card-actions>
      </v-dialog>
  </v-row>
</template>

<script>

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
    this.notecomments=[];
  }
  getNote(){
    return this.notecomments;
  }
  appendNote(noteObj){
    this.notecomments.push(noteObj);
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
  },
  data () {
    return {
      title: 'Video Comment',
      dialog: false,
      isBookmarking: false,
      isPencil: false,
      currentTime: null,
      currentVideo: null,
      editor: null,
      imgEditor: null,
      items: [
        {
          icon: 1,
          title: 'Start',
          time: 0,
          comment: []
        },
        {
          icon: 2,
          title: 'Bookmark',
          time: 3,
        },
        {
          icon: 3,
          title: 'Bookmark',
          time: 5,
        },
        {
          icon: 4,
          title: 'Bookmark',
          time: 9,
        }
      ],
      temps: [],
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
      let currentComment = document.getElementById('currentComment');
      this.currentVideo.currentTime = item.time;
      this.currentVideo.pause();
      currentComment = `${ item.comment }`;
    },
    addBookmark(){
      this.currentVideo = document.getElementById('currentVideo');
      this.currentVideo.pause();
      this.currentTime = this.currentVideo.currentTime
      console.log(this.currentTime);
      this.isBookmarking= true;
      let item= new Bookmark(this.items.length,`${this.currentTime}`, this.currentTime, null)
      this.items.push(item);

    },
    screenshot(){
      const video = document.getElementById("currentVideo")
      let canvas = document.querySelector("canvas");
      const context = canvas.getContext("2d");

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      if(!video){
        console.warn(' is not exist.')
        return false
      }
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataURL = canvas.toDataURL("image/jpg");
      console.log(dataURL)
    },

    showCoords(event){
      console.log(event);
      let x= event.clientX;
      let y= event.clientY;
      console.log( `Coordinate:(${x},${y})`);
      let note=document.createElement('v-textarea');
    },
    openDialog(){
      this.dialog=true;
      this.currentVideo = document.getElementById('currentVideo');
      this.currentVideo.pause();
    },
    async addImage(){
      const video = document.getElementById("currentVideo")
      let canvas = document.querySelector("canvas");
      const context = canvas.getContext("2d");

      canvas.width = 300
      canvas.height = 150

      await context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const dataURL = canvas.toDataURL("image/jpg");
      this.editor.chain().focus().setImage({src: dataURL}).run()

      this.temps.push();
      console.log(this.temps.length);

      let addBtn = document.getElementById('addImage');
      try{
        addBtn.classList.remove("ProseMirror ProseMirror-focused")
      }
      catch (e){
        console.log(e)
      }
      addBtn.onclick = (event) => {
        console.log(event)
      }
    },
  },
}
</script>

<style>
.note{
  background-color: khaki;
  position: relative;
}
.editBar{
  background-color: lightskyblue;
}
.editDoc{
  background-color: lightpink;
}

</style>
