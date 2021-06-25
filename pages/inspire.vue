<template>
  <v-row>
    <v-col class="text-center">
      <img
        src="/v.png"
        alt="Vuetify.js"
        class="mb-5"
      >

      <div class="text-left">
        <span id="fileField"></span>
        <span id="addVideobtn">
        <v-btn class="addFilebtn" @click="dialog = !dialog">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
        </span>
      </div>

      <blockquote class="blockquote">
        &#8220;First, solve the problem. Then, write the code.&#8221;
        <footer>
          <small>
            <em>&mdash;John Johnson</em>
          </small>
        </footer>
      </blockquote>

      <v-dialog v-model="dialog" width="500" v-if="dialog">
        <v-file-input id="inputVideo" accept=".mp4" label="File input">
        </v-file-input>
        <v-card-text class="text-center">
          <em><small>&mdash; Only MP4 format allowed</small></em>
          <hr class="my-3">
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            id ="addBtn"
            color="primary"
            to="/editVideo"
            @click="addVideo"
          >
            Add Video
          </v-btn>
        </v-card-actions>
      </v-dialog>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data(){
    return{
      dialog: false,
      src : null
    }
  },
  methods:{
    addVideo(){
      this.src= document.getElementById('inputVideo').files[0];
      console.log(this.src);
      this.dialog=false;
    }
  }
}
</script>

<style>
.addFilebtn{
  min-height: 160px;
  width: 140px;
  border-style: dashed;
}
</style>
