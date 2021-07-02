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
        <v-col cols="12" md="8">
          <v-row id="videoArea" no-gutters>
            <video
                id="currentVideo"
                style="margin-left: 0px; padding-left: 0px;"
                width="100%"
                controls
                muted
                src="/video/Cat-66004.mp4"
                @click="isBookmarking? openDialog: null"></video>
            <div
              id="clickPlane"
              v-if="isBookmarking"
              @click="setNote($event)"
              class="clickPlane"
              width="100%">
              <canvas></canvas>
            </div>
          </v-row>

          <v-divider></v-divider>
          <v-row id="bookmarkArea" no-gutters>
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
    this.notecomments=[];
    this.prenote=null;
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

  data () {
    return {
      title: 'Video Comment',
      dialog: false,
      isBookmarking: false,
      isPencil: false,
      currentTime: null,
      currentVideo: null,
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
      let canvas = document.getElementById("screenCapture");
      const context = canvas.getContext("2d");

      if(!video){
        console.warn(' is not exist.')
        return false
      }

      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      console.log(canvas.toDataURL());
    },
    goFront(event){
      console.log(event);
      let target = event.target;
      let videoArea = document.getElementById('videoArea');
      let clickArea = document.getElementById('clickPlane');

      if(this.prenote != target){

        console.log('inside If');
        console.log(this.prenote);
        console.log(target);

        this.prenote.zIndex;
        target.zIndex;
        this.prenote = target;
      }
    },
    setNote(event){
      let x= event.offsetY;
      let y= event.offsetX;
      console.log( `Coordinate:(${x},${y})`);

      let note=document.createElement('textarea');
      note.setAttribute('class', 'note');
      note.style.top=`${x}px`;note.style.left=`${y}px`;
      let videoArea=document.getElementById('videoArea');
      videoArea.appendChild(note);
      note.onclick=this.goFront;
      this.prenote = note;
    },
    openDialog(){
      this.dialog=true;
    }
  },
}
</script>

<style>
.note{
  background-color: khaki;
  opacity: 70%;
  border: 1px solid black;
  position: absolute;
  text-align: center;
  z-index: 1;
}
.clickPlane{
  background-color: aquamarine;
  opacity: 70%;
  position: absolute;
  z-index: 1;
}

</style>
