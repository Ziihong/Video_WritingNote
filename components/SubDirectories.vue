<template>
  <v-col>
    <v-row>폴더</v-row>
    <v-row>
      <template v-for="dir of directories" class="file">
        <div class="directory">
          <v-icon left @click="goDirectory(dir)">mdi-folder</v-icon>
          <span @click="goDirectory(dir)"> {{ dir.data().name }}</span>
          <button>
            <v-icon right @click="modalOpen(dir)">mdi-pen</v-icon>
          </button>
          <button>
            <v-icon right @click="removeDirectory(dir)">mdi-close-box</v-icon>
          </button>
        </div>
      </template>
    </v-row>
    <modal
      :isModalViewed="this.isModalViewed"
      :title="'이름 바꾸기'"
      @modal-close="modalClose"
      @modal-ok="modalRename">
    </modal>
  </v-col>
</template>

<script>
import Modal from '~/components/Modal'

export default {
  name: "SubDirectories",
  props: {
    parentId: String,
  },
  data() {
    return {
      isModalViewed: false,
      directories: [],
      fileUrls: [],
      renameDirectory: '', //obj
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
    modalOpen(dir) {
      this.isModalViewed = true;
      this.renameDirectory = dir;
    },
    async modalRename(rename) {
      if (rename == undefined) {
        return alert("이름을 입력해주세요");
      } else {
        await this.$fire.firestore
          .doc(`users/${this.$fire.auth.currentUser.uid}/directories/${this.renameDirectory.id}`)
          .update({
            name: rename,
          });
        this.isModalViewed = false;
        this.viewDirectories();
      }
    },
    modalClose() {
      this.isModalViewed = false;
    },
  },
}
</script>

<style scoped>
.directory {
  display: inline-block;
  padding: 10px;
  margin: 10px;
  border-radius: 10px;
  border: solid 1px cornflowerblue;
}

</style>
