<template>
  <v-col>
    <v-row>폴더</v-row>
    <v-row>
      <template v-for="dir of directories" class="file">
        <div class="directory-wrap">
          <div class="title-wrap">
            <v-icon left @click="goDirectory(dir)">mdi-folder</v-icon>
            <span @click="goDirectory(dir)"> {{ dir.data().name }}</span>
          </div>
          <div class="button-wrap">
            <button>
              <v-icon @click="renameModalOpen(dir)">mdi-pen</v-icon>
            </button>
            <button>
              <v-icon @click="moveModalOpen(dir)">mdi-swap-horizontal</v-icon>
            </button>
            <button>
              <v-icon @click="removeDirectory(dir)">mdi-close-box</v-icon>
            </button>
          </div>
        </div>
      </template>
    </v-row>
    <ModalRename v-if="this.isRename"
      :isShowed="this.isRename"
      :title="'이름 바꾸기'"
      @rename-close="renameModalClose"
      @rename-ok="renameModalOk">
    </ModalRename>
    <ModalMove v-if="this.isMove"
      :isShowed="this.isMove"
      :moveObj = "this.moveDirectory.id"
      @move-close="moveModalClose"
      @move-ok="moveModalOk">
    </ModalMove>
  </v-col>
</template>

<script>
import ModalRename from "/components/ModalRename";
import ModalMove from "/components/ModalMove";

export default {
  name: "SubDirectories",
  components: {
    ModalRename,
    ModalMove,
  },
  props: {
    parentId: String,
  },
  data() {
    return {
      isRename: false,
      isMove: false,
      directories: [],
      fileUrls: [],
      renameDirectory: '', //obj
      moveDirectory:'',
      moveDirectoryId:''
    }
  },
  mounted() {
    this.viewDirectories();
  },
  methods: {
    viewDirectories() {
      this.directories = [];
      const dirStorageRef = this.$fire.firestore
        .collection(`users/${this.$fire.auth.currentUser.uid}/directories`);
      dirStorageRef.orderBy('name').where('parentId', '==', this.parentId)
        .onSnapshot((async querySnapshot => {
          this.directories = querySnapshot.docs;
          // console.log(this.directories);
        }));
    },
    goDirectory(dir) {
      this.$router.push(`/directories/${dir.id}`);
    },
    async removeDirectory(dir) {
      // console.log("remove!", dir);
      const delConfirm = confirm("폴더와 하위 항목들을 완전히 삭제하시겠습니까?");
      if (delConfirm == true) {
        let subDirectories = [dir.id];
        let subFiles = [];

        // delete sub directories
        while (subDirectories.length != 0) {
          // console.log("Start loop");
          let currentId = subDirectories.pop();
          // console.log("currentID:", currentId);
          // console.log("currentList:", subDirectories);
          await this.$fire.firestore.doc(`users/${this.$fire.auth.currentUser.uid}/directories/${currentId}`).delete();
          const dirStorageRef = await this.$fire.firestore.doc(`users/${this.$fire.auth.currentUser.uid}/`)
            .collection('directories');
          await dirStorageRef.where("parentId", "==", currentId).get()
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                subDirectories.push(doc.id);
                console.log(doc.id, doc.data().name);
              });
            });
          const fileStorageRef = await this.$fire.firestore.doc(`users/${this.$fire.auth.currentUser.uid}/`)
            .collection('files');
          await fileStorageRef.where("parentId", "==", currentId).get()
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                subFiles.push(doc.id);
              });
            });
        }

        // delete sub files
        for (let i = 0; i < subFiles.length; i++) {
          await this.$fire.firestore.doc(`users/${this.$fire.auth.currentUser.uid}/files/${subFiles[i]}`).delete();
        }
        // console.log("end loop");
        this.viewDirectories();
      }
    },
    moveModalOpen(dir){
      this.isMove = true;
      this.moveDirectory = dir;
    },
    moveModalClose(){
      this.isMove = false;
    },
    async moveModalOk(dir){
      this.isMove = false;
      const selectDirectory = dir;
      await this.$fire.firestore
        .doc(`users/${this.$fire.auth.currentUser.uid}/directories/${this.moveDirectory.id}`)
        .update({
          parentId: selectDirectory.id,
        });
    },
    renameModalOpen(dir) {
      this.isRename = true;
      this.renameDirectory = dir;
    },
    renameModalClose() {
      this.isRename = false;
    },
    async renameModalOk(rename) {
      this.isRename = false;
      await this.$fire.firestore
        .doc(`users/${this.$fire.auth.currentUser.uid}/directories/${this.renameDirectory.id}`)
        .update({
          name: rename,
        });
    },
  },
}
</script>

<style scoped>
.directory-wrap {
  display: inline-block;
  width:200px;
  height: 40px;
  padding: 10px;
  margin: 10px;
  border-radius: 10px;
  border: solid 1px cornflowerblue;
}

.title-wrap{
  display:inline-block;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
  width:90px;
}

.button-wrap{
  display: inline-block;
  float:right;
}

</style>
