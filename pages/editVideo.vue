<template>
<v-row no-gutters>
  <v-col cols="12" sm="8" md="8">
    <video
      style="margin-left: 0px; padding-left: 0px;"
      width="100%"
      controls
      muted
      src="/video/Cat-66004.mp4">
    </video>
  </v-col>
  <v-col cols="12" md="4">
    <v-row no-gutters>
      <v-col>
        <p class="text-center">Bookmarks</p>
          <v-list
          style="max-height: 130px"
          class="overflow-y-auto">
            <v-list-item
              v-for="(item, i) in items"
              :key="i"
              :to="item.to"
              router
              exact
            >
              <v-list-item-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title v-text="item.title" />
              </v-list-item-content>
            </v-list-item>
          </v-list>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col>
        <v-textarea
          filled
          full-width
          height="260"
          name="input"
          label="Add your comment."
          value=""
        ></v-textarea>
      </v-col>
    </v-row>
  </v-col>
</v-row>
</template>

<script>
export default {
  layout:'editbar',
  data () {
    return {
      items: [
        {
          icon: 1,
          title: 'Home',
          to: '/'
        },
        {
          icon: 2,
          title: 'Inspire',
          to: '/inspire'
        },
        {
          icon: 3,
          title: 'Inspire',
          to: '/inspire'
        },
        {
          icon: 4,
          title: 'Inspire',
          to: '/inspire'
        }
      ],
      miniVariant: false,
      right: true,
      title: 'Vuetify.js'
    }
  }
}
</script>

<style scoped>

</style>
