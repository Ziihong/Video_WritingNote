<template>
  <v-app dark>
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
    <v-main>
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
            <v-input
              id="clickPlane"
              v-if="isBookmarking"
              @click="showCoords(event)"
              style="
              width: 58.3%;
              height: 67%;
              position: absolute;
              z-index: 2">
            </v-input>

            <template id="note">
            </template>
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
            </div>
            <editor-content :editor="editor" class="editDoc"/>
            <button class="btnDocSave">Save</button>
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
    </v-main>
  </v-app>
</template>

<script>

import { Editor, EditorContent } from '@tiptap/vue-2'
import StarterKit from '@tiptap/starter-kit'

class Bookmark{
  constructor(index, inputTitle, inputTime, noteComments){
    this.icon=index+1;
    this.title=inputTitle;
    this.time=inputTime;
    this.notecomments=[];
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
      components:{
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
        }
      },
      mounted() {
        this.editor = new Editor({
          extensions: [
            StarterKit,
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
          let item= new Bookmark(this.items.length+1,`${this.currentTime}`, this.currentTime, null)
          this.items.push(item);

        },
        showCoords(event){
          let x= event.clientX;
          let y= event.clientY;
          console.log("Yo");
          console.log( `Coordinate:(${x},${y})` );
        },
        openDialog(){
          this.dialog=true;
          this.currentVideo = document.getElementById('currentVideo');
          this.currentVideo.pause();
        }
      },
}
</script>

<style scoped>
.editBar{
  background-color: lightskyblue;
}
.editDoc{
  background-color: lightpink;
}

</style>
