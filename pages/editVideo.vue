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
        <v-col cols="12" md="4">
          <v-textarea
            id="currentComment"
            filled
            full-width
            height="250"
            label="Add your comment."
          ></v-textarea>
          <span>ScreenCapture</span>
          <span><v-btn icon style="background-color: aquamarine;">
          <v-icon @click="screenshot">mdi-minus</v-icon>
        </v-btn></span>
          <canvas id="screenCapture" style="border: 1px solid black; width: 100%;"></canvas>

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

    screenshot(){
      const video = document.getElementById("currentVideo")
      let canvas = document.getElementById("screenCapture");
      const context = canvas.getContext("2d");

      if(!video){
        console.warn(' is not exist.')
        return false
      }

      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      console.log(canvas.toDataURL());
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
    }
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
