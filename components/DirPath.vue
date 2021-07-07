<template>
  <v-col>
    <span v-for="path of pathIds">
      <span id="angle"> > </span>
      <v-btn color="primary" outlined @click="goPath(path)"> {{ path.name }} </v-btn>
    </span>
  </v-col>
</template>

<script>
export default {
  name: "DirPath",
  props: {
    currentId: String,
  },
  data(){
    return{
      pathIds:[
        {
          pathId:'',
          name:'내 보관함',
          parentId:'',
        }
      ],
    }
  },
  mounted(){
    this.queryPath();
  },
  methods:{
    async queryPath(){
      this.pathIds = [];

      if (this.currentId == ''){
        this.pathIds.push({pathId: '', name: '내 보관함', parentId: ''});
        return;
      }

      let tempPathIds = [];
      let currentId = this.currentId;
      let currentDir;

      await this.$fire.firestore
        .collection(`users/${this.$fire.auth.currentUser.uid}/directories`)
        .doc(currentId)
        .get().then((doc) => {
          if (doc.exists) {
            currentDir = doc;
          }
        });

      while (true) {
        //console.log('Start loop');
        tempPathIds.push({pathId: currentDir.id, name: currentDir.data().name, parentId: currentDir.data().parentId});
        let pid = currentDir.data().parentId;
        if (pid == '') {
          break;
        }

        await this.$fire.firestore
          .collection(`users/${this.$fire.auth.currentUser.uid}/directories`)
          .doc(pid)
          .get().then((doc) => {
            if (doc.exists) {
              currentDir = doc;
            }
          });
      }
      tempPathIds.push({pathId: '', name: '내 보관함', parentId: ''});
      for (let i = tempPathIds.length - 1; i >= 0; i--) {
        this.pathIds.push(tempPathIds[i]);
      }
    },
    goPath(path){
      if (path.pathId == ''){ this.$router.push(`/myfiles`); }
      else{ this.$router.push(`/directories/${path.pathId}`); }

    },
  },
}
</script>

<style scoped>
#angle{
  color: cornflowerblue;
}
</style>
