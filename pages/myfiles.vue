<template>
  <div id="app">
    <div v-if="isLoggedIn">
    <v-col>
      <v-container>
        <v-row>
          <create-dir-btn :parentId="this.directoryId"></create-dir-btn>
          <up-dir-btn :parentId="this.directoryId"></up-dir-btn>
          <up-file-btn :parentId="this.directoryId"></up-file-btn>
        </v-row>
      </v-container>
      <v-container>
        <hr>
        <dir-path :currentId="this.directoryId"></dir-path>
        <hr>
      </v-container>
      <v-container>
        <sub-directories :parentId="this.directoryId"></sub-directories>
      </v-container>
      <v-container>
        <sub-files :parentId="this.directoryId"></sub-files>
      </v-container>
    </v-col>
    </div>
    <div v-else>
      <login></login>
    </div>
  </div>
</template>

<script>
import SubFiles from '~/components/SubFiles'
import SubDirectories from "/components/SubDirectories";
import CreateDirBtn from "/components/CreateDirBtn";
import UpFileBtn from "/components/UpFileBtn";
import UpDirBtn from "/components/UpDirBtn";
import DirPath from "/components/DirPath";
import login from "/pages/login";
import {mapGetters, mapState} from 'vuex';

export default {
  components: {
    login,
    DirPath,
    UpDirBtn,
    UpFileBtn,
    CreateDirBtn,
    SubDirectories,
    SubFiles,
  },
  computed:{
    ...mapState({
      authUser: state => state.authUser,
    }),
    ...mapGetters({
      isLoggedIn: 'isLoggedIn',
    }),
  },
  data() {
    return {
      directoryId: '',
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
