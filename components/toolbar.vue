<template>
  <v-row class="edit-toolbar">
    <v-btn @click = "textEdit('bold')" >
      <v-icon>
        mdi-format-bold
      </v-icon>
    </v-btn>
    <v-btn @click = "textEdit('italic')" >
      <v-icon>
        mdi-format-italic
      </v-icon>
    </v-btn>
    <v-btn @click = "textEdit('underline')" >
      <v-icon>
        mdi-format-underline
      </v-icon>
    </v-btn>
    <v-btn @click = "textEdit('strikeThrough')" >
      <v-icon>
        mdi-format-strikethrough
      </v-icon>
    </v-btn>
  </v-row>
</template>

<script>
export default {
  name: "toolbar",
  data() {
    return{

    }
  },
  methods: {
    textEdit: function (command) {
      document.execCommand(command);
    },
  }
}
</script>

<style scoped>
.edit-toolbar{
  margin-bottom: 30px;
  margin-top : 10px;
}
</style>
