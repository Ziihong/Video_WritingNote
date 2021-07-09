<template>
  <div>
<span class="btn">
    <v-btn color="primary" class="filebox" @click="modalOpen">
      <v-icon left>mdi-folder-plus-outline</v-icon>
      <span>새 폴더</span>
    </v-btn>
</span>
    <ModalRename
      :isShowed="this.isRename"
      :title="'새 폴더'"
      @rename-close="modalClose"
      @rename-ok="modalCreate">
    </ModalRename>
  </div>
</template>

<script>
import ModalRename from "/components/ModalRename";

export default {
  name: "CreateDir",
  components: {
    ModalRename,
  },
  props: {
    parentId: String,
  },
  data() {
    return {
      isRename : false,
      createName:'',
    }
  },
  methods:{
    modalOpen(){
      this.isRename = true;
    },
    async modalCreate(createName){
      this.isRename = false;
      if (createName == undefined) {
        return alert("이름을 입력해주세요");
      }
      else {
        await this.$fire.firestore
          .collection(`users/${this.$fire.auth.currentUser.uid}/directories`)
          .add({
            name: createName,
            parentId: this.parentId,
            timestamp: this.$fireModule.firestore.FieldValue.serverTimestamp()
          });
      }
    },
    modalClose(){
      this.isRename = false;
    },
  }
}
</script>

<style scoped>
.filebox{
  display: inline-block;
  padding: .5em .75em;
  font-size: small;
  line-height: normal;
  vertical-align: middle;
  cursor: pointer;
}

.btn{
  margin: 0 10px 15px 0;
}

</style>
