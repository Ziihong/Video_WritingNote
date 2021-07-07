<template>
  <div>
    <!-- modal box -->
    <div id="modal-wrap">
      <template v-if="isShowed">
        <!-- inner modal -->
        <div id="modal-box">
          <h2> 폴더 선택</h2>
          <div class="select-wrap">
          <v-select v-model="selectDirectory"
                    return-object
                    :items="directories"
                    item-text = "name"
                    label="이동 할 폴더 선택">
          </v-select>
          </div>
          <v-btn color="primary" @click="$emit('move-ok', selectDirectory)">확인</v-btn>
          <v-btn color="white" @click="$emit('move-close')">취소</v-btn>
        </div>
        <label id="modal-bg"></label>
      </template>
    </div>

  </div>
</template>

<script>
export default {
  name: "ModalMove",
  props:{
    isShowed: Boolean,
  },
  data(){
    return{
      directoryObjs:[],
      directories:[],
      selectDirectory:'',
    }
  },
  mounted(){
    this.queryDirectory();
  },
  methods:{
    queryDirectory(){
      const storageRef = this.$fire.firestore
        .collection(`users/${this.$fire.auth.currentUser.uid}/directories`);
      storageRef.orderBy('parentId').orderBy('name')
        .onSnapshot((async querySnapshot => {
          this.directoryObjs = querySnapshot.docs;
          for(let i = 0; i<this.directoryObjs.length; i++){
            this.directories.push({
              id: this.directoryObjs[i].id,
              name: this.directoryObjs[i].data().name,
              parentId: this.directoryObjs[i].data().parentId,
            })
          }
        }));
    },
  }
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
  z-index: 101;
}
</style>
