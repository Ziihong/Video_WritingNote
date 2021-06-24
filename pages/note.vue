<template>
  <v-row justify="left" align="left">
    <v-col cols="8">
      <video controls src="/hd.mp4" class="videoHd"></video>
      <div class="rightDiv">
        <v-btn color="white" @click="" class="note">노트</v-btn>
        <v-btn color="white" @click="" class="comment">코멘트</v-btn>
        <br><br>
        <input v-if="!isLoggedIn" type="text" placeholder="로그인 후 가능합니다." class="textBoxN" disabled/>
        <input v-else type="text" placeholder="노트를 쓰세요" class="textBoxY"/>
      </div>
    </v-col>
  </v-row>
</template>

<script>

import {mapGetters, mapState} from "vuex";

export default {
  computed: {
    ...mapState({
      authUser: state => state.authUser,
    }),
    ...mapGetters({
      isLoggedIn: 'isLoggedIn',
    }),
  },
  async noteClick() {

  },
}
</script>

<style scoped>
.videoHd {
  position: absolute;
  left: 100px;
  width: 800px;
  height: 600px;
}
.rightDiv {
  position: absolute;
  right: 100px;
}
.note {
  background-color: white;
  border: 1px solid black;
}
.textBoxN {
  border: 1px solid grey;
  width: 400px;
  height: 300px;
}
.textBoxY {
  border: 1px solid grey;
  width: 400px;
  height: 300px;
}
</style>
