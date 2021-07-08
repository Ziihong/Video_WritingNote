<template>
  <v-container>
  <v-col>
    <v-col>
    <v-row>
      <create-dir-btn :parentId="this.directoryId"></create-dir-btn>
      <up-dir-btn :parentId="this.directoryId"></up-dir-btn>
      <up-file-btn :parentId="this.directoryId"></up-file-btn>
    </v-row>
    </v-col>
    <hr>
    <dir-path :currentId="this.directoryId"></dir-path>
    <hr>
    <sub-directories :parentId="this.directoryId"></sub-directories>
    <sub-files :parentId="this.directoryId"></sub-files>
  </v-col>
  </v-container>
</template>

<script>
import SubFiles from '~/components/SubFiles'
import SubDirectories from "../../components/SubDirectories";
import CreateDirBtn from "../../components/CreateDirBtn";
import UpFileBtn from "../../components/UpFileBtn";
import UpDirBtn from "../../components/UpDirBtn";
import DirPath from "../../components/DirPath";

export default {
  components: {
    DirPath,
    UpDirBtn,
    UpFileBtn,
    CreateDirBtn,
    SubDirectories,
    SubFiles,
  },
  data() {
    return {
      directoryId: this.$route.params.id,
    }
  },
}
</script>

<style scoped>
hr{
  size:1px;
  color:cornflowerblue;
  margin: 10px 0 10px 0 ;
}
</style>
