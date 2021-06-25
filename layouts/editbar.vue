<template>
  <v-app dark>
    <v-app-bar
      fixed
      app
    >
      <v-btn
      to="/">
        <v-icon left>
          mdi-home
        </v-icon>
        Home
      </v-btn>
      <v-toolbar-title class="text-center" v-text="title" />
      <v-spacer />
    </v-app-bar>
    <v-main>
      <v-container fluid>
        <nuxt/>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      title: 'Edit Video'
    }
  },
}
</script>

<style scoped>

</style>
