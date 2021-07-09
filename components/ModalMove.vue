<template>
  <div id="app">
    <v-row justify="center">
      <v-dialog persistent max-width="400px" v-model="isShowed">
        <v-card>
          <v-card-title> 폴더 이동 </v-card-title>
          <v-card-text>
            <v-container>
              <v-select v-model="selectDirectory"
                        return-object
                        :items="directories"
                        item-text = "name"
                        label="이동 할 폴더 선택">
              </v-select>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-btn color="blue darken-1" text @click="moveClose">취소</v-btn>
            <v-btn color="blue darken-1" text @click="moveOk">확인</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "ModalMove",
  props:{
    isShowed: Boolean,
    moveObj: String,
  },
  data(){
    return{
      directoryObjs:[],
      directories:[],
      selectDirectory:'',
    }
  },
  created(){
    this.queryDirectory();
  },
  methods:{
    queryDirectory(){
      this.directories = [];
      const storageRef = this.$fire.firestore
        .collection(`users/${this.$fire.auth.currentUser.uid}/directories`);
      storageRef.orderBy('parentId').orderBy('name')
        .onSnapshot((async querySnapshot => {
          this.directoryObjs = querySnapshot.docs;
          for(let i = 0; i<this.directoryObjs.length; i++){
            //console.log("move!", this.moveObj);
            if (this.moveObj == this.directoryObjs[i].id) continue;
            this.directories.push({
              id: this.directoryObjs[i].id,
              name: this.directoryObjs[i].data().name,
              parentId: this.directoryObjs[i].data().parentId,
            })
          }
        }));
    },
    moveClose(){
      this.$emit('move-close');
      this.selectDirectory = '';
    },
    moveOk(){
      if (this.selectDirectory == ''){
        return alert('폴더를 선택하지 않았습니다.');
      }
      this.$emit('move-ok', this.selectDirectory);
      this.selectDirectory = '';
    }
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
