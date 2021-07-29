<template>
  <v-row style="padding: 20px">
    <form id="loginForm">
      <div class="input-field" style="margin: 10px">
        <label>User ID</label>
        <input type="text" placeholder="User ID" id="userID">
      </div>
      <v-row>
        <div style="margin: 10px">
          <v-btn color="primary" id="login" @click="loginUser"
          >LOGIN</v-btn>
          <v-btn type="button" id="logout" @click="logoutUser"
          >LOGOUT</v-btn>
        </div>
      </v-row>
    </form>
    <v-row style="margin: 10px">
      <div id="log"></div>
    </v-row>
    <template v-for="(member) of userList">
      <li>{{member}}</li>
    </template>
    <v-row style="margin: 10px">
      <v-form class="canvas-drawbar">
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
      </v-form>
      <v-form id="event-form">
        <div id="event">
          <canvas id="drawing-canvas" width="700" height="300"
                  @mousemove="canvasMousemove"
                  @mousedown="canvasMousedown"
                  @mouseleave="stopPainting"
                  @mouseup="stopPainting"
          ></canvas>
        </div>
      </v-form>
    </v-row>
  </v-row>
</template>

<script>
import AgoraRTM from 'agora-rtm-sdk';

import {RtmTokenBuilder,RtmRole} from 'agora-access-token';

export default {
  data() {
    return{
      appId: "",
      appCertificate: "",
      clientID: "",
      channel: "",
      userList: [],
      options: {
        uid: "",
        token: "",
      },
      activeBtn : '',
      curColor : '#001dff',
      brushSize :  '3.5',
      isPainting : false,
      paintMode : 'draw',
      undoStack : [],
      redoStack : [],
      trueFalseCheck: false,
      isTrueSet: false,
      pos: [],
      x: null,
      y: null,
    }
  },
  created() {
    this.appId = "e68902b5adbf4686abbf25626ba75b91";
    this.appCertificate = "8789fcbdc5514adbb59cbc42f17ee7fb";
    this.clientID = AgoraRTM.createInstance(this.appId);
    const self = this;
    this.clientID.on('MessageFromPeer', function (message, peerId) {
      document.getElementById("log").appendChild(document.createElement('div')).append("Message from: " + peerId + " Message: " + message.text)
      document.getElementById("log").scrollTop = document.getElementById("log").scrollHeight;
    });
    // Display connection state changes
    this.clientID.on('ConnectionStateChanged', function (state, reason) {
      document.getElementById("log").appendChild(document.createElement('div')).append("State changed To: " + state + " Reason: " + reason)
    });
    this.channel = this.clientID.createChannel("demoChannel");
    this.channel.on('ChannelMessage', async function (message, memberId) {
      if(message.messageType=='TEXT') {
        const self = this;

        // true, false가 정확한 시간에 오지 않고 좌표값보다 느리거나 빠르게 옴, 따라서 그릴때랑 안그릴때의 좌표값이 섞임.
        if(message.text === "true" || message.text === "false"){
          self.isTrueSet = (message.text === 'true');
        }
        else{
          self.pos = message.text.split(",");
        }

        self.x = parseInt(self.pos[0]);
        self.y = parseInt(self.pos[1]);
        const memberCursor = document.getElementById(`cursor-${memberId}`);
        memberCursor.style.left = self.x+"px";
        memberCursor.style.top = `${self.y}px`;

        this.canvas = document.querySelector("#drawing-canvas");

        this.isPainting = self.isTrueSet;
        this.context = this.canvas.getContext('2d');
        this.context.globalAlpha = 1;
        this.context.lineWidth = '3.5';

        if(!this.isPainting){
          this.context.beginPath();
          this.context.moveTo(self.x, self.y);
        }
        else{
          this.context.lineTo(self.x, self.y);
          this.context.stroke();
        }
      }
      else{
        console.log('Other type');
      }
      document.getElementById("log").scrollTop = document.getElementById("log").scrollHeight;
    })
    // Display channel member stats
    this.channel.on('MemberJoined', function (memberId) {
      document.getElementById("log").appendChild(document.createElement('div')).append(memberId + " joined the channel")
      document.getElementById("log").scrollTop = document.getElementById("log").scrollHeight;
      self.userList.push(memberId);

      self.createCursor(memberId);
    })
    // Display channel member stats
    this.channel.on('MemberLeft', function (memberId) {
      document.getElementById("log").appendChild(document.createElement('div')).append(memberId + " left the channel")
      document.getElementById("log").scrollTop = document.getElementById("log").scrollHeight;
      self.userList = self.userList.filter((member)=>member!=memberId);

      self.removeCursor(memberId);
    })

  },
  mounted() {
    this.channel.getMembers().then((memberList)=>{
      this.userList = memberList;
    });
    this.canvas = document.getElementById('drawing-canvas');

    this.context = this.canvas.getContext('2d');
    const printImg = document.createElement('img');

    this.context.drawImage(printImg, 0, 0, this.canvas.width, this.canvas.height);
    this.undoStack.push(this.context.getImageData(0,0,this.canvas.width,this.canvas.height));
    this.isCanvasViewed = true;
    this.context.strokeStyle = this.curColor;
    this.context.lineWidth = this.brushSize;
  },
  methods: {
    createCursor(memberId){
      // create join member cursor
      const eventForm = document.getElementById("event");
      const memberCursor = document.createElement("div");
      memberCursor.classList.add("cursor");
      memberCursor.id = "cursor-"+memberId;
      eventForm.append(memberCursor);
      // set cursor to random background color and size;
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      const bgColor = "rgb(" + r + "," + g + "," + b + ")";
      memberCursor.style.background = bgColor;
      memberCursor.style.border = "solid 1px black";
      memberCursor.style.width = "10px";
      memberCursor.style.height = "10px";
      memberCursor.style.position = "absolute";
      memberCursor.style.left = "0px";
      memberCursor.style.top = "0px";
    },
    removeCursor(memberId){
      const eventForm = document.getElementById("event");
      const memberCursor = document.getElementById(`cursor-${memberId}`);
      eventForm.removeChild(memberCursor);
    },
    async loginUser(){
      this.options.uid = document.getElementById("userID").value.toString();
      this.options.token = this.tokenGenerate(this.options.uid);
      console.log('RTM Tokens : '+this.options.token);
      await this.clientID.login(this.options).catch(function (err){
        console.log('AgoraRTM client login failure!!!');
      });
      await this.channel.join().then(()=>{
        document.getElementById("log").appendChild(document.createElement('div'))
          .append("You have successfully joined channel " + this.channel.channelId)
      }).catch(function (err){
        console.log('AgoraRTM channel join failure!!!');
      });
      this.channel.getMembers().then((memberList)=>{
        this.userList = memberList;
        for(let i =0; i<this.userList.length; i++){
          if (this.userList[i] == this.options.uid) continue;
          this.createCursor(this.userList[i]);
        }
      });
    },
    async logoutUser(){
      await this.clientID.logout().catch(function (err){
        console.log('AgoraRTM client logout failure!!!');
      });
      if (this.channel != null) {
        await this.channel.leave().catch(function (err){
          console.log('Channel leaving failed!');
        });
        this.userList = this.userList.filter((member)=>member!=this.options.uid);
      }
      else
      {
        console.log("Channel is empty");
      }
      const eventForm = document.getElementById("event");
      while (eventForm.hasChildNodes()){
        eventForm.removeChild(eventForm.firstChild);
      }
    },
    tokenGenerate(account){
      const expirationTimeInSeconds = 7200;
      const currentTimestamp = Math.floor(Date.now() / 1000);
      const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;
      const token = RtmTokenBuilder.buildToken(this.appId, this.appCertificate, account, RtmRole, privilegeExpiredTs);
      return token;
    },
    canvasMousedown: function (){
      if(!this.isPainting && (this.paintMode==='draw'||this.paintMode==='light') ) this.isPainting = true;
    },
    async canvasMousemove(event){
      const x = event.offsetX;
      const y = event.offsetY;
      let channelMessage = x + "," + y;

      // exceed 180 message in 3sec error handling. But cause drawing error
      try {
        if (this.channel != null) {
          await this.channel.sendMessage({text: channelMessage})
        }
        // Send True for one time cause it make error when message sent more than 180 in 3 sec
        if (this.channel != null && this.isPainting === true && this.trueFalseCheck === false) {
          this.trueFalseCheck = true;
          await this.channel.sendMessage({text: this.isPainting.toString()})
        }
        // Send False for one time
        if (this.channel != null && this.isPainting === false && this.trueFalseCheck === true) {
          this.trueFalseCheck = false;
          await this.channel.sendMessage({text: this.isPainting.toString()})
        }
      } catch (e) {
        console.log(e);
      }
      const self = this;
      self.canvas = document.querySelector("#drawing-canvas");
      self.context = self.canvas.getContext('2d');
      self.context.globalAlpha = 1;
      self.context.lineWidth = this.brushSize;

      if(!this.isPainting){
        self.context.beginPath();
      }
      else{
        if(this.paintMode==='light'){
          self.context.globalAlpha = 0.03;
          self.context.lineWidth = self.brushSize*2;
        }
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
    undoExec: function (){
      console.log(this.undoStack);
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
  }
}
</script>

<style scoped>
.input-field{
  margin: 10px;
}
input{
  border: #222222 solid 1px;
  margin-left: 5px;
}
#log{
  border: #222222 solid 1px;
  overflow : auto;
  width: 700px;
  height: 200px;
  padding: 10px;
  display: flex;
  flex-direction: column;
}
#event-form{
  border: #95999c solid 1px;
  border-radius: 10px;
  width: 700px;
  height: 300px;
  background-color: #95999c;
}
#event-form div{
  border: #95999c solid 1px;
  border-radius: 10px;
  width: 700px;
  height: 300px;
  background-color: #95999c;
  position: absolute;
}
</style>

