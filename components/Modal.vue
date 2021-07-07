<template>
  <div>
    <!-- modal box -->
    <div id="modal-wrap">
      <template v-if="isModalViewed">
      <!-- inner modal -->
      <div id="modal-box">
        <h2> {{ title }}</h2>
        <v-text-field clearable placeholder="이름을 입력하세요" v-model="rename"></v-text-field>
        <v-btn color="primary" @click="$emit('modal-ok', rename)">확인</v-btn>
        <v-btn color="white" @click="$emit('modal-close')">취소</v-btn>
      </div>
      <label id="modal-bg"></label>
      </template>
    </div>

  </div>
</template>

<script>
export default {
  props: {
    title: String,
    name: String,
    isModalViewed: Boolean,
  },
  data(){
    return{
      rename:this.name,
    }
  },
  computed:{}
}
</script>

<style scoped>

/* 모달창 팝업 시 배경 어둡게 */
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

/* 모달 박스 */
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
