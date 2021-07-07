<template>
<span class="btn">
    <v-btn color="primary" class="filebox" @click="modalOpen">
      <v-icon left>mdi-folder-plus-outline</v-icon>
      <span>새 폴더</span>
    </v-btn>
    <modal
      :isModalViewed="this.isModalViewed"
      :title="'새 폴더'"
      @modal-close="modalClose"
      @modal-ok="modalCreate">
  </modal>
</span>
</template>

<script>
export default {
  name: "CreateDir",
  props: {
    parentId: String,
  },
  data() {
    return {
      isModalViewed : false,
      createName:'',
      directories: [],
    }
  },
  methods:{
    viewDirectories(){
      this.directories = [];
      const dirStorageRef = this.$fire.firestore
        .collection(`users/${this.$fire.auth.currentUser.uid}/directories`);
      dirStorageRef.orderBy('name').where('parentId', '==', this.parentId)
        .onSnapshot((async querySnapshot => {
          this.directories = querySnapshot.docs;
        }));
    },
    modalOpen(){
      this.isModalViewed = true;
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
        this.isModalViewed = false;
        this.$emit('reload');
      }
    },
    modalClose(){
      this.isModalViewed = false;
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
