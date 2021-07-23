<template>
  <div>
    <div class="container-fluid banner">
      <p class="banner-text">Share The Screen</p>
      <a style="color: rgb(255, 255, 255);fill: rgb(255, 255, 255);fill-rule: evenodd; position: absolute; right: 10px; top: 4px;"
         class="Header-link " href="https://github.com/AgoraIO-Community/AgoraWebSDK-NG/tree/master/Demo">
        <svg class="octicon octicon-mark-github v-align-middle" height="32" viewBox="0 0 16 16" version="1.1" width="32" aria-hidden="true"><path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg>
      </a>
    </div>

    <div id="success-alert" class="alert alert-success alert-dismissible fade show" role="alert">
      <strong>Congratulations!</strong><span> You can invite others join this channel by click </span><a href="" target="_blank">here</a>
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div id="success-alert-with-token" class="alert alert-success alert-dismissible fade show" role="alert">
      <strong>Congratulations!</strong><span> Joined room successfully. </span>
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>

    <div class="container">
      <form id="join-form">
        <div class="row join-info-group">
          <div class="col-sm">
            <p class="join-info-text">AppID</p>
            <input id="appid" type="text" placeholder="enter appid" required>
            <p class="tips">If you don`t know what is your appid, checkout <a href="https://docs.agora.io/en/Agora%20Platform/terms?platform=All%20Platforms#a-nameappidaapp-id">this</a></p>
          </div>
          <div class="col-sm">
            <p class="join-info-text">Token(optional)</p>
            <input id="token" type="text" placeholder="enter token">
            <p class="tips">If you don`t know what is your token, checkout <a href="https://docs.agora.io/en/Agora%20Platform/terms?platform=All%20Platforms#a-namekeyadynamic-key">this</a></p>
          </div>
          <div class="col-sm">
            <p class="join-info-text">Channel</p>
            <input id="channel" type="text" placeholder="enter channel name" required>
            <p class="tips">If you don`t know what is your channel, checkout <a href="https://docs.agora.io/en/Agora%20Platform/terms?platform=All%20Platforms#channel">this</a></p>
          </div>
        </div>

        <div class="button-group">
          <button id="join" type="submit" class="btn btn-primary btn-sm">Join</button>
          <button id="leave" type="button" class="btn btn-primary btn-sm" disabled>Leave</button>
        </div>
      </form>

      <div class="row video-group">
        <div class="col">
          <p id="local-player-name" class="player-name"></p>
          <div id="local-player" class="player"></div>
        </div>
        <div class="w-100"></div>
        <div class="col">
          <div id="remote-playerlist"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import AgoraRTC from "agora-rtc-sdk";
import AgoraRTC from "agora-rtc-sdk-ng"
export default {
  data(){
    return{
      rtc: {
        localAudioTrack: null,
        localVideoTrack: null,
        client: null
      },
      // Create agora client
      client:AgoraRTC.createClient({ mode: "rtc", codec: "vp8" }),
      localTracks: {
        videoTrack: null,
        audioTrack: null,
      },
      remoteUser:{},
      // agora client options
      options:{
        appid:"b6c52e8f864c4a7d93fa6da1c8a31f4b",
        channel: "test",
        token:"006b6c52e8f864c4a7d93fa6da1c8a31f4bIAAkueYn7lOc1jvdGgV+38tqRT5xqDWeak1wWdH5H5ViRQx+f9gAAAAAEAAZP2Q5inr7YAEAAQCKevtg",
        uid:null,
      },
    }
  },
  async created(){
    // // the demo can auto join channel with params in url
    // const urlParams = new URL(location.href).searchParams;
    // options.appid = urlParams.get("appid");
    // options.channel = urlParams.get("channel");
    // options.token = urlParams.get("token");
    // console.log("urlParams:", urlParams);
    // console.log("options:", options.appid, options.channel, options.token);
    // if(options.appid && options.channel){
    //   this.options.appid = options.appid;
    //   this.options.token = options.token;
    //   this.options.channel = options.channel;
    //   console.log("this.options:", this.options.appid, this.options.token, this.options.channel);
    // }
    // add event listener to play remote tracks when remote user publishs.
    this.client.on("user-published", this.handleUserPublished);
    this.client.on("user-unpublished", this.handleUserUnpublished);
    await this.join();
  },
  methods:{
    async join() {
      const options = this.options;
      const localTracks = this.localTracks;

      // join a channel and create local tracks, we can use Promise.all to run them concurrently
      [ options.uid, localTracks.audioTrack, localTracks.videoTrack ] = await Promise.all([
        // join the channel
        this.client.join(options.appid, options.channel, options.token || null),
        // ** create local tracks, using microphone and screen
        AgoraRTC.createMicrophoneAudioTrack(),
        AgoraRTC.createScreenVideoTrack()
      ]);

      // play local video track
      localTracks.videoTrack.play("local-player");
      const playerName = document.querySelector('#local-player-name');
      // playerName.text(`localVideo(${options.uid})`);
      console.log("PlayerName:", playerName);
      // $("#local-player-name").text(`localVideo(${options.uid})`);

      // publish local tracks to channel
      await this.client.publish(Object.values(localTracks));
      console.log("publish success");
    },
    async subscribe(user, mediaType) {
      const uid = user.uid;
      // subscribe to a remote user
      await this.client.subscribe(user, mediaType);
      console.log("subscribe success");

      // html append video
      if (mediaType === 'video') {
        const player = $(`
      <div id="player-wrapper-${uid}">
        <p class="player-name">remoteUser(${uid})</p>
        <div id="player-${uid}" class="player"></div>
      </div>
    `);
        const playerList = document.querySelector('#remote-playerlist');
        console.log("playerList,", playerList);
        playerList.append(player);
        user.videoTrack.play(`player-${uid}`);

        // $("#remote-playerlist").append(player);
        // user.videoTrack.play(`player-${uid}`);
      }
      if (mediaType === 'audio') {
        user.audioTrack.play();
      }
    },
    handleUserPublished(user, mediaType) {
      // console.log("function handle~");
      const id = user.uid;
      this.remoteUsers[id] = user;
      console.log("handle~ user:",user);
      this.subscribe(user, mediaType);
    },
    handleUserUnpublished(user) {
      const id = user.uid;
      delete this.remoteUsers[id];
      const removePlayer = document.querySelector(`#player-wrapper-${id}`);
      removePlayer.remove();
      // $(`#player-wrapper-${id}`).remove();
    }
  }
}
</script>

<style scoped>

</style>


<!--<template>-->
<!--  <div id="content">-->
<!--    <div class="wrap">-->
<!--      <v-btn color="primary" @click="startScreenShare">Start</v-btn>-->
<!--      <video id="videoOrigin" autoplay></video>-->
<!--    </div>-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--export default {-->
<!--  data() {-->
<!--    return {-->
<!--      constraints: {-->
<!--        audio: true,-->
<!--        video: {-->
<!--          width: 1980, // 최대 너비-->
<!--          height: 1080, // 최대 높이-->
<!--          frameRate: 10, // 최대 프레임-->
<!--        },-->
<!--      }-->
<!--    }-->
<!--  },-->
<!--  methods: {-->
<!--    async startScreenShare() {-->
<!--      console.log("Start screen share!");-->
<!--      const stream = await this.start();-->
<!--      this.onLocalStream(stream);-->
<!--    },-->
<!--    async start() {-->
<!--      let localStream;-->
<!--      try {-->
<!--        localStream = await this.getCrossBrowserScreenCapture();-->
<!--      } catch (err) {-->
<!--        console.error('Error getDisplayMedia', err);-->
<!--      }-->
<!--      return localStream;-->
<!--    },-->
<!--    onLocalStream(stream) {-->
<!--      console.log('onLocalStream', stream);-->
<!--      const $video = document.querySelector('#videoOrigin');-->
<!--      $video.srcObject = stream;-->
<!--    },-->
<!--    getCrossBrowserScreenCapture() {-->
<!--      if (navigator.getDisplayMedia) {-->
<!--        return navigator.getDisplayMedia(this.constraints);-->
<!--      } else if (navigator.mediaDevices.getDisplayMedia) {-->
<!--        return navigator.mediaDevices.getDisplayMedia(this.constraints);-->
<!--      }-->
<!--    },-->
<!--  }-->
<!--}-->


<!--</script>-->

<!--<style scoped>-->
<!--button {-->
<!--  cursor: pointer;-->
<!--  margin: 0 0 1em 0;-->
<!--  padding: 0.4em 0.7em 0.5em 0.7em;-->
<!--  min-width: 100px;-->
<!--  border-radius: 2px;-->
<!--  color: white;-->
<!--  font-size: 1em;-->
<!--}-->

<!--.wrap {-->
<!--  width: 720px;-->
<!--  margin: 0 auto;-->
<!--}-->

<!--video {-->
<!--  margin: 0 0 20px 0;-->
<!--  width: 100%;-->
<!--  height: auto;-->
<!--  background: #222;-->
<!--}-->

<!--</style>-->
