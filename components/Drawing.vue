<template>
  <v-dialog
    v-model="isCanvasViewed"
    max-width="1000"
    @click:outside="closeCanvas"
    @close="closeCanvas"
    id="drawing-wrap"
    :eager="true"
  >
    <v-card>
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
          <input type="color" value='#001dff' class="color-palettes" @change="colorChange">
        </v-btn>
        <v-btn @click="undoExec" id="undobtn">
          <v-icon>
            mdi-undo
          </v-icon>
        </v-btn>
        <v-btn @click="redoExec" id="redobtn">
          <v-icon>
            mdi-redo
          </v-icon>
        </v-btn>
        <v-btn @click="canvasClear">
          clear
        </v-btn>
        <input type="range" @input="rangeChange" min="0.2" max="10.0" value="3.5" step="0.1"/>
        <v-btn color="primary" @click="saveCanvas">
          <v-icon>
            mdi-content-save
          </v-icon>
        </v-btn>
        <v-btn color="primary" @click="closeCanvas">
          <v-icon>
            mdi-close
          </v-icon>
        </v-btn>
      </v-row>
      <canvas id="drawing-canvas"
              @mousemove="canvasMousemove"
              @mousedown="canvasMousedown"
              @mouseleave="stopPainting"
              @mouseup="stopPainting"
      ></canvas>
    </v-card>
  </v-dialog>
</template>

<script>

export default {
  data() {
    return{
      activeBtn : '',
      curColor : '#001dff',
      brushSize : '3.5',
      isPainting : false,
      paintMode : 'draw',
      undoStack : [],
      redoStack : [],
      targetImage : '',
    };
  },
  props: [
    'isCanvasViewed',
    'imageSrc',
  ],
  mounted() {
    this.activeBtn = 'drawbtn';
  },
  methods: {
    drawingImage: async function(canvasSrc,vwidth, vheight) {
      this.canvas = document.getElementById('drawing-canvas');this.canvas.width = vwidth;
      this.canvas.height = vheight;

      this.context = this.canvas.getContext('2d');
      const printImg = document.createElement('img');
      printImg.src = canvasSrc;

      await this.context.drawImage(printImg, 0, 0, this.canvas.width, this.canvas.height);
      this.undoStack.push(this.context.getImageData(0,0,this.canvas.width,this.canvas.height));
      this.isCanvasViewed = true;
      this.context.strokeStyle = this.curColor;
      this.context.lineWidth = this.brushSize;
    },
    drawMode: function (){
      this.paintMode='draw';
      this.btnprev = document.getElementById(`${this.activeBtn}`);
      this.btnnow = document.getElementById('drawbtn');
      this.btnprev.classList.remove("active");
      this.btnnow.classList.add("active");
      this.activeBtn = 'drawbtn';
    },
    lightMode: function (){
      this.paintMode='light';
      this.btnprev = document.getElementById(`${this.activeBtn}`);
      this.btnnow = document.getElementById('lightbtn');
      this.btnprev.classList.remove("active");
      this.btnnow.classList.add("active");
      this.activeBtn = 'lightbtn';
    },
    selectMode: function (){
      this.paintMode='select';
      this.isPainting = false;
      this.btnprev = document.getElementById(`${this.activeBtn}`);
      this.btnnow = document.getElementById('selectbtn');
      this.btnprev.classList.remove("active");
      this.btnnow.classList.add("active");
      this.activeBtn = 'selectbtn';
    },
    textMode: function (){
      this.paintMode='text';
      this.isPainting = false;
      this.btnprev = document.getElementById(`${this.activeBtn}`);
      this.btnnow = document.getElementById('textbtn');
      this.btnprev.classList.remove("active");
      this.btnnow.classList.add("active");
      this.activeBtn = 'textbtn';
    },
    eraseMode: function (){
      this.paintMode='erase';
      this.isPainting = false;
      this.btnprev = document.getElementById(`${this.activeBtn}`);
      this.btnnow = document.getElementById('erasebtn');
      this.btnprev.classList.remove("active");
      this.btnnow.classList.add("active");
      this.activeBtn = 'erasebtn';
    },
    colorChange: function (event){
      this.canvas = document.querySelector("#drawing-canvas");
      this.context = this.canvas.getContext('2d');
      this.curColor = event.target.value;
      this.context.strokeStyle = event.target.value;
    },
    rangeChange: function (event){
      this.canvas = document.querySelector("#drawing-canvas");
      this.context = this.canvas.getContext('2d');
      this.context.lineWidth = event.target.value;
      this.brushSize = event.target.value;
    },
    canvasMousedown: function (){
      if(!this.isPainting && (this.paintMode==='draw'||this.paintMode==='light') ) this.isPainting = true;
    },
    canvasMousemove: function (event){
      const x = event.offsetX;
      const y = event.offsetY;

      const self = this;
      self.canvas = document.querySelector("#drawing-canvas");
      self.context = self.canvas.getContext('2d');
      self.context.globalAlpha = 1;
      self.context.lineWidth = this.brushSize;

      if(!this.isPainting){
        self.context.beginPath();
        self.context.moveTo(x,y);
      }
      else{
        if(this.paintMode==='light'){
          self.context.globalAlpha = 0.03;
          self.context.lineWidth = self.brushSize*2;
        }
        // else if(this.paintMode==='erase'){
        //   this.context.globalCompositeOperation = "destination-out";
        //   this.context.strokeStyle = "rgba(0,0,0,1)";
        //   console.log('erase');
        // }
        self.context.lineTo(x,y);
        self.context.stroke();
      }
    },
    stopPainting: function (){
      this.canvas = document.querySelector("#drawing-canvas");
      this.context = this.canvas.getContext('2d');
      if(this.isPainting===true){
        this.undoStack.push(this.context.getImageData(0,0,this.canvas.width,this.canvas.height));
        this.redoStack.length=0;
      }
      this.isPainting = false;
    },
    undoExec: function (){
      if (this.undoStack.length <= 1){
        return;
      }
      this.canvas = document.querySelector("#drawing-canvas");
      this.context = this.canvas.getContext('2d');
      this.redoStack.push(this.undoStack[this.undoStack.length - 1]);
      this.undoStack.pop();
      this.context.putImageData(this.undoStack[this.undoStack.length - 1],0,0);
    },
    redoExec: function (){
      if (this.redoStack.length < 1){
        return;
      }
      this.canvas = document.querySelector("#drawing-canvas");
      this.context = this.canvas.getContext('2d');
      this.undoStack.push(this.redoStack[this.redoStack.length - 1]);
      this.context.putImageData(this.redoStack[this.redoStack.length - 1],0,0);
      this.redoStack.pop();
    },
    canvasClear: function (){
      const originImg = document.createElement('img');
      originImg.src = this.imageSrc;
      this.canvas = document.querySelector("#drawing-canvas");
      this.context = this.canvas.getContext('2d');

      this.context.drawImage(originImg, 0, 0, this.canvas.width, this.canvas.height);
      this.undoStack.push(this.context.getImageData(0,0,this.canvas.width,this.canvas.height));
    },
    saveCanvas: function (){
      this.canvas = document.querySelector("#drawing-canvas");
      const canvasURL = this.canvas.toDataURL();
      this.isCanvasViewed = false;
      this.undoStack.length = 0;
      this.redoStack.length = 0;
      this.$emit('changeImage',canvasURL);
    },
    closeCanvas: function (){
      this.isCanvasViewed = false;
      this.undoStack.length = 0;
      this.redoStack.length = 0;
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
  background-color: white;
  margin: 1%;
  width: 90%;
}
#drawing-wrap{
  background-color: white;
  padding : 1%;
  justify-content: center;
}
</style>
