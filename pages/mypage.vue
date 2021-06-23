<template>
  <v-row>
    <v-col cols="8">
      <v-row>
        <input type="file" color="primary" />
      </v-row>
      <v-row>
        <video width="640" height="340" controls="controls"
               poster=https://cdn.pixabay.com/photo/2021/01/28/18/21/beach-5958718_960_720.jpg >
          <source src='/드렁큰마리오_5s.mp4' type="video/mp4">
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
