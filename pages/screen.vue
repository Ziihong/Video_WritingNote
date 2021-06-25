<template>
  <v-row>
    <v-col>
      <div>
        <v-btn
          color="primary"
          to="/myfiles"
        >
          내 파일함
        </v-btn>
        <input type="text" placeholder="제목을 입력하세요">
      </div>
      <video v-bind:src=videoUrl autoplay controls loop>
        비디오를 지원하지않습니다.
      </video>
    </v-col>
    <v-col>
      <v-row>
        <v-btn color="primary" class="btn">공유</v-btn>
        <v-btn color="primary" class="btn">다운로드</v-btn>
        <v-btn color="primary" class="btn">삭제</v-btn>
        <br>
      </v-row>
      <v-row>
        <v-btn color="white" class="btn">노트</v-btn>
        <v-btn color="white" class="btn">코멘트</v-btn>
      </v-row>
      <v-textarea color="black"></v-textarea>
    </v-col>
  </v-row>


</template>

<script>
export default {
  data: () => ({
    videoUrl: "/cat.mp4"
  }),
}
</script>

<style scoped>
video {
  width: 800px;
  height: 480px;
}

.btn{
  margin:10px 5px 0 0;
}

</style>
