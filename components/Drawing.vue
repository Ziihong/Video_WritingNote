<template>
  <v-row class="canvas-drawbar">
    <v-btn @click="selectMode">
      <v-icon>
        mdi-cursor-default-outline
      </v-icon>
    </v-btn>
    <v-btn @click="drawMode">
      <v-icon>
        mdi-brush
      </v-icon>
    </v-btn>
    <v-btn @click="lightMode">
      <v-icon>
        mdi-grease-pencil
      </v-icon>
    </v-btn>
    <v-btn>
      <v-icon>
        mdi-eraser
      </v-icon>
    </v-btn>
    <v-btn @click="textMode">
      <v-icon>
        mdi-format-textbox
      </v-icon>
    </v-btn>
    <v-btn>
      <input type="color" value='#001dff' class="color-palettes" @change="changeColor">
    </v-btn>
    <v-btn @click="clearMode">
      clear
    </v-btn>
    <input type="range" @input="changeRange" min="0.2" max="10.0" value="3.5" step="0.1"/>
  </v-row>
</template>

<script>
export default {
  methods: {
    changeColor: function (event){
      let curColor = event.target.value;
      this.$emit('colorCall',curColor);
    },
    changeRange: function (event){
      let curRange = event.target.value;
      this.$emit('rangeCall',curRange);
    },
    drawMode: function (){
      this.$emit('modeCall','draw');
    },
    lightMode: function (){
      this.$emit('modeCall','light');
    },
    selectMode: function (){
      this.$emit('modeCall','select');
    },
    textMode: function (){
      this.$emit('modeCall','text');
    },
    eraseMode: function (){
      this.$emit('modeCall','erase');
    },
    clearMode: function (){
      this.$emit('clearCall');
    },
  },
}
</script>

<style scoped>
.color-palettes{
  width: 30px;
  height: 30px;
  border-radius: 25px;
  cursor: pointer;
}
</style>
