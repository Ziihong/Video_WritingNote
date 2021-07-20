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
    <select id="fontSelect" @change="editFontSize">
      <option selected>선택</option>
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
      <option value="4">4</option>
      <option value="5">5</option>
      <option value="6">6</option>
      <option value="8">8</option>
      <option value="8">10</option>
      <option value="18">18</option>
      <option value="20">20</option>
    </select>
  </v-row>
</template>

<script>
export default {
  name: "toolbar",
  methods: {
    textEdit: function (command) {
      document.execCommand(command);
    },
    async editFontSize() {
      let size = document.getElementById("fontSelect");
      await document.execCommand("fontsize", false, size.value);
    }
  }
}
</script>

<style scoped>

.edit-toolbar{
  /*width: 100%;*/
  margin-bottom: 30px;
  margin-top : 10px;
}
#fontSelect {
  width:50px;
  padding:5px;
  border:1px solid #999;
  border-radius:3px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance : none;
}
</style>
