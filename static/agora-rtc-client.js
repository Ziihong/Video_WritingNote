import AgoraRTC from 'agora-rtc-sdk'
import EventEmitter from 'events'

export default class RTCClient {
  constructor() {
    // Options for joining a channel
    this.option = {
      appid: "",
      token: "",
      channel: "",
      uid: "",
    }
    this.client = null
    this.localStream = null
    this._eventBus = new EventEmitter()
  }

  clientListener() {
    const client = this.client

    client.on('stream-added', (evt) => {
      // The stream is added to the channel but not locally subscribed
      this._eventBus.emit('stream-added', evt)
    })
    client.on('stream-subscribed', (evt) => {
      this._eventBus.emit('stream-subscribed', evt)
    })
    client.on('stream-removed', (evt) => {
      this._eventBus.emit('stream-removed', evt)
    })
    client.on('peer-online', (evt) => {
      this._eventBus.emit('peer-online', evt)
    })
    client.on('peer-leave', (evt) => {
      this._eventBus.emit('peer-leave', evt)
    })
  }
  on(eventName, callback) {
    this._eventBus.on(eventName, callback)
  }
  joinChannel(option) {
    return new Promise((resolve, reject) => {
      this.client = AgoraRTC.createClient({mode: "rtc", codec: "vp8"})
      this.client.init(option.appid, () => {
        console.log("init success")
        this.clientListener()
        this.client.join(option.token, option.channel, option.uid, () => {
          this.option = {
            appid: option.appid,
            token: option.token,
            channel: option.channel,
            uid: option.uid,
          }
          resolve()
        }, (err) => {
          console.log(err)
        })
      }, (err) => {
        reject(err)
      })
    })
  }
  leaveChannel() {
    return new Promise((resolve, reject) => {
      // Leave the channel
      this.client.unpublish(this.localStream, (err) => {
        console.log(err)
      })
      this.client.leave(() => {
        // Stop playing the local stream
        if (this.localStream.isPlaying()) {
          this.localStream.stop()
        }
        // Close the local stream
        this.localStream.close()
        this.client = null
        resolve()
        console.log("client leaves channel success");
      }, (err) => {
        reject(err)
        console.log("channel leave failed");
      })
    })
  }
  publishVideoCall() {
    return new Promise((resolve, reject) => {
      // Create a local stream
      this.localStream = AgoraRTC.createStream({
        streamID: this.option.uid,
        audio: true,
        video: true,
        screen: false,
      })
      // Initialize the local stream
      this.localStream.init(() => {
        console.log("init local stream success")
        resolve(this.localStream)
        // Publish the local stream
        this.client.publish(this.localStream, (err) =>  {
          console.log(err)
        })
      }, (err) => {
        reject(err)
        console.error("init local stream failed ", err)
      })
    })
  }
  publishVoiceCall() {
    return new Promise((resolve, reject) => {
      // Create a local stream
      this.localStream = AgoraRTC.createStream({
        streamID: this.option.uid,
        audio: true,
        video: false,
        screen: false,
      })
      // Initialize the local stream
      this.localStream.init(() => {
        console.log("init local stream success")
        resolve(this.localStream)
        // Publish the local stream
        this.client.publish(this.localStream, (err) =>  {
          console.log(err)
        })
      }, (err) => {
        reject(err)
        console.error("init local stream failed ", err)
      })
    })
  }
}
