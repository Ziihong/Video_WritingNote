<template>
  <v-row no-gutters>
    <v-col cols="12" sm="8" md="8">
      <video
        id="currentVideo"
        style="margin-left: 0px; padding-left: 0px;"
        width="100%"
        controls
        muted
        src="/video/Cat-66004.mp4">
      </video>
    </v-col>,
    <v-col cols="12" md="4">
      <v-row no-gutters>
        <v-col>
          <p class="text-center">Bookmarks</p>
          <v-list
            style="max-height: 130px"
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
      <v-row no-gutters>
        <v-col>
          <v-textarea
            filled
            full-width
            height="260"
            name="input"
            label="Add your comment."
            value=""
          ></v-textarea>
          <v-btn>
            <v-icon @click="screenshot">mdi-minus</v-icon>
          </v-btn>
          <canvas></canvas>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>

export default {
  layout:'editbar',
  data () {
    return {
      items: [
        {
          icon: 1,
          title: 'Start',
          time: 0,
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
      propTitle: 'mypdf',
    }
  },
  methods:{
    jumpTime(item){
      let currentVideo = document.getElementById('currentVideo');
      currentVideo.currentTime = item.time;
      currentVideo.pause();
    },

    screenshot(){
      const video = document.getElementById("currentVideo")
      let canvas = document.querySelector("canvas");
      canvas.width = 300
      canvas.height = 150
      const context = canvas.getContext("2d");

      if(!video){
        console.warn(' is not exist.')
        return false
      }

      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      let frame = context.getImageData(0, 0, video.videoWidth, video.videoHeight);
      console.log(canvas.toDataURL());
    },
  }
}
</script>

<style scoped>

</style>
