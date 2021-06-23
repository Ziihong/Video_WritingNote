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
      <iframe width="956" height="538" v-bind:src=youtubeUrl
              title="YouTube video player" frameborder="0" muted="muted"
              id="media_frame"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
      </iframe>
      <form method="post" @submit="changeSrc" onsubmit="return false;">
        <input v-model="youtubeUrl"
               class="url-input"
        />
        <v-btn
          color="primary"

        >Enter</v-btn>
      </form>
    </v-col>
  </v-row>
</template>

<script>

export default {
  data: () => ({
    youtubeUrl : 'https://www.youtube.com/watch?v=YrTwfIlTLsg?autoplay=true',
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
