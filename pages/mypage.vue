<template>
  <v-row>
    <v-col cols="8">
      <v-row>
        <input type="file" id="fileupload" hidden/>
      </v-row>
      <v-row>
        <v-btn color="primary">
          <v-icon left>
            mdi-arrow-left-circle
          </v-icon>
          내 파일함</v-btn>
        <input placeholder="제목을 입력하세요" type="text"
               style="width: 40%; background-color:white;"/>
      </v-row>
      <v-row>
        <video width="100%" height="500" controls id="player" src="/hd.mp4">
          브라우저가 비디오 플레이를 지원하지 않습니다
        </video>
        <div id="marker">

        </div>
<!--        <video id="myVideo" ref="player" class="video-js vjs-big-play-centered vjs vjs-fluid" data-setup="{}">-->
<!--          <source src="/hd.mp4" type="video/mp4">-->
<!--          브라우저가 비디오 플레이를 지원하지 않습니다-->
<!--        </video>-->
      </v-row>
    </v-col>
    <v-col cols="4" class="comment-box">
      <v-row>
        <v-btn color="primary" @click="choiceFile">새파일</v-btn>
        <v-btn color="primary">test2</v-btn>
        <v-btn color="primary">test3</v-btn>
      </v-row>
      <v-row>
        <v-btn>노트</v-btn>
        <v-btn>코멘트</v-btn>
      </v-row>
      <v-row>
        <textarea wrap="virtual" rows="8" cols="40"
                  style="height: 450px"
                  placeholder="내용을 입력하세요"
                  ref="textareaObj"
                  id="textBox"
        ></textarea>
      </v-row>
      <v-row>
        <v-btn color="primary">save</v-btn>
        <v-btn color="primary" @click="makeMarker">Mark</v-btn>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>

export default {

  data() {
    return {
    };
  },
  mounted() {
    console.log(this.player)
    // console.log('this is current player instance object', this.player)
  },
  methods: {
    choiceFile: function (){
      document.getElementById("fileupload").click();
    },
    makeMarker: function(){
      let tmp = document.getElementById("player");
      let value = this.$refs.textareaObj.value;
      let time = tmp.currentTime;
      let newBtn = document.createElement('button');
      let txt = document.createTextNode("000");
      newBtn.style.backgroundColor="red";
      newBtn.style.borderRadius = '50%';
      newBtn.appendChild(txt);
      document.getElementById('marker').appendChild(newBtn);
      newBtn.addEventListener('click', function(){
        tmp.currentTime = time;
        document.getElementById('textBox').value = value;
      });
    }
  }
}
</script>

<style scoped>
.comment-box{
  height: 600px;
  background-color: white;
}
.video-frame{
  max-width: 100%;
  height: auto;
}
</style>
