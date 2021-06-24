<template>
  <v-row>
    <v-col cols="8">
      <v-row>
        <input type="file" color="primary" />
      </v-row>
      <v-row>
        <video width="640" height="340" controls autoplay muted
               src="/static/cat.mp4"
               >
          브라우저가 비디오 플레이를 지원하지 않습니다
        </video>
      </v-row>
    </v-col>
    <v-col cols="4" class="comment-box">
      <v-row>
        <v-btn color="primary">test1</v-btn>
        <v-btn color="primary">test2</v-btn>
        <v-btn color="primary">test3</v-btn>
      </v-row>
      <v-row>
        <textarea wrap="virtual" rows="8" cols="40"
                  style="height: 500px"
                  placeholder="내용을 입력하세요"
        ></textarea>
      </v-row>
      <v-row>
        <v-btn color="primary">save</v-btn>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>

export default {
  methods: {

  }
}
</script>

<style scoped>
.comment-box{
  height: 600px;
  background-color: white;
}
</style>
