<template>
  <div id="app">
    <v-row justify="center">
    <v-dialog persistent max-width="400px" v-model="isShowed">
      <v-card>
        <v-card-title> {{ title }}</v-card-title>
        <v-card-text>
          <v-container>
            <v-text-field required label="이름을 입력하세요." v-model="rename">
            </v-text-field>
          </v-container>
        </v-card-text>
        <v-card-actions>
        <v-btn color="blue darken-1" text @click="$emit('rename-close')">취소</v-btn>
        <v-btn color="blue darken-1" text @click="$emit('rename-ok', rename)">확인</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    </v-row>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    name: String,
    isShowed: Boolean,
  },
  data(){
    return{
      rename:'',
    }
  },
}
</script>

<style scoped>
#modal-bg {
  position: fixed;
  top: 0;
  left: 0;
  display: block;
  height: 100%;
  width: 100%;
  background: #ddd;
  opacity: 0.6;
  z-index: 100;
}

#modal-box {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  min-width: 400px;
  min-height: 200px;
  padding:20px;
  background: #fff;
  border: solid cornflowerblue 2px;
  border-radius: 20px;
  z-index: 101; /* 다른 요소보다 위에 떠야해서 z축 값을 크게 줌 */
}
</style>
