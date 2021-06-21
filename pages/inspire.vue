<template>
  <v-row>
    <v-col class="text-center">
      <img
        src="/v.png"
        alt="Vuetify.js"
        class="mb-5"
      >
      <blockquote class="blockquote">
        &#8220;First, solve the problem. Then, write the code.&#8221;
        <footer>
          <small>
            <em>&mdash;John Johnson</em>
          </small>
        </footer>
      </blockquote>
      <iframe width="956" height="538" src="https://www.youtube.com/embed/csXjZ7F6YzM?autoplay=1"
              title="YouTube video player" frameborder="0" muted="muted"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
      </iframe>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data: () => ({
    youtubeUrl: '',
    isUrl: false
  }),
  methods: {
    changeSrc(){
      const frame = document.getElementById("media_frame");
      frame.src = this.youtubeUrl+"?autoplay=1";
      console.log(frame.src);
      this.isUrl = true;
    }
  }
}
</script>

<style>
.url-input{
  width: 800px;
  background-color: white;
}
</style>
