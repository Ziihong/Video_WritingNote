<template>
  <v-row class="canvas-drawbar">
    <v-btn @click="selectMode" id="selectbtn">
      <v-icon>
        mdi-cursor-default-outline
      </v-icon>
    </v-btn>
    <v-btn @click="drawMode" id="drawbtn" class="active">
      <v-icon>
        mdi-brush
      </v-icon>
    </v-btn>
    <v-btn @click="lightMode" id="lightbtn">
      <v-icon>
        mdi-grease-pencil
      </v-icon>
    </v-btn>
    <v-btn @click="eraseMode" id="erasebtn">
      <v-icon>
        mdi-eraser
      </v-icon>
    </v-btn>
    <v-btn @click="textMode" id="textbtn">
      <v-icon>
        mdi-format-textbox
      </v-icon>
    </v-btn>
    <v-btn>
      <input type="color" value='#001dff' class="color-palettes" @change="changeColor">
    </v-btn>
    <v-btn @click="undoMode" id="undobtn">
      <v-icon>
        mdi-undo
      </v-icon>
    </v-btn>
    <v-btn @click="redoMode" id="redobtn">
      <v-icon>
        mdi-redo
      </v-icon>
    </v-btn>
    <v-btn @click="clearMode">
      clear
    </v-btn>
    <input type="range" @input="changeRange" min="0.2" max="10.0" value="3.5" step="0.1"/>
  </v-row>
</template>

<script>
export default {
  data() {
    return{
      activeBtn : '',
    };
  },
  mounted() {
    this.activeBtn = 'drawbtn';
  },
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
      this.btnprev = document.getElementById(`${this.activeBtn}`);
      this.btnnow = document.getElementById('drawbtn');
      this.btnprev.classList.remove("active");
      this.btnnow.classList.add("active");
      this.activeBtn = 'drawbtn';
    },
    lightMode: function (){
      this.$emit('modeCall','light');
      this.btnprev = document.getElementById(`${this.activeBtn}`);
      this.btnnow = document.getElementById('lightbtn');
      this.btnprev.classList.remove("active");
      this.btnnow.classList.add("active");
      this.activeBtn = 'lightbtn';
    },
    selectMode: function (){
      this.$emit('modeCall','select');
      this.btnprev = document.getElementById(`${this.activeBtn}`);
      this.btnnow = document.getElementById('selectbtn');
      this.btnprev.classList.remove("active");
      this.btnnow.classList.add("active");
      this.activeBtn = 'selectbtn';
    },
    textMode: function (){
      this.$emit('modeCall','text');
      this.btnprev = document.getElementById(`${this.activeBtn}`);
      this.btnnow = document.getElementById('textbtn');
      this.btnprev.classList.remove("active");
      this.btnnow.classList.add("active");
      this.activeBtn = 'textbtn';
    },
    eraseMode: function (){
      this.$emit('modeCall','erase');
      this.btnprev = document.getElementById(`${this.activeBtn}`);
      this.btnnow = document.getElementById('erasebtn');
      this.btnprev.classList.remove("active");
      this.btnnow.classList.add("active");
      this.activeBtn = 'erasebtn';
    },
    undoMode: function (){
      this.$emit('undoCall');
    },
    redoMode: function (){
      this.$emit('redoCall');
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
.active{
  border : dimgrey solid 5px;
}
.canvas-drawbar{
  display: block;
}
</style>
