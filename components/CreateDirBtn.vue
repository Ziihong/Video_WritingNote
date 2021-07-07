<template>
<span class="btn">
    <v-btn color="primary" class="filebox" @click="modalOpen">
      <v-icon left>mdi-folder-plus-outline</v-icon>
      <span>새 폴더</span>
    </v-btn>
    <ModalRename
      :isShowed="this.isRename"
      :title="'새 폴더'"
      @modal-close="modalClose"
      @modal-ok="modalCreate">
    </ModalRename>
</span>
</template>

<script>
import ModalRename from "/components/ModalRename";
import ModalMove from "./ModalMove";

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
      if (createName == undefined) {
        return alert("이름을 입력해주세요");
      }
      else {
        await this.$fire.firestore
          .collection(`users/${this.$fire.auth.currentUser.uid}/directories`)
          .add({
            name: createName,
            parentId: this.parentId,
          });
        this.isRename = false;
        this.$emit('reload');
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
