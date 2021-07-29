<template>
  <div class="videoPlayer" ref="player" :id="domId"></div>
</template>

<script>
export default {
  props: [
    'stream',
    'domId',
  ],
  mounted () {
    this.$nextTick(function () {
      if (this.stream && !this.stream.isPlaying()) {
        this.stream.play(`${this.domId}`, (err) => {
          if (err && err.status !== 'aborted') {
            console.warn('trigger autoplay policy')
          }
        })
      }
    })
  },
}
</script>

<style>
.videoPlayer {
  height: 100%;
  width: 100%;
}
</style>
