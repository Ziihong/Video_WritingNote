<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
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
    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="clipped"
      fixed
      app
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-btn
        icon
        @click.stop="miniVariant = !miniVariant"
      >
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-btn
        icon
        @click.stop="clipped = !clipped"
      >
        <v-icon>mdi-application</v-icon>
      </v-btn>
      <v-btn
        icon
        @click.stop="fixed = !fixed"
      >
        <v-icon>mdi-minus</v-icon>
      </v-btn>
      <v-toolbar-title v-text="title" />
      <v-spacer />

      <div v-if="!isLoggedIn" id="Login/Register">
        <v-btn
          :to="'/login'"
        >
          <v-icon left>
            mdi-account
          </v-icon>
          log-in/Register
        </v-btn>
        </div>

      <div v-else id="Logout">
        <span >Welcome, {{ this.name }}.</span>
        <span>
          <v-btn
            @click="logout"
          >
            <v-icon left>mdi-account</v-icon>
            Logout
          </v-btn>
        </span>
      </div>

    </v-app-bar>

    <v-main>
      <v-container>
        <nuxt/>
      </v-container>
    </v-main>

    <v-footer
      :absolute="!fixed"
      app
    >
      <span>&copy; {{ new Date().getFullYear() }}</span>
      <v-spacer/>
      <span v-if="isLoggedIn">You are logged in with {{ authUser.email }}.</span>
    </v-footer>
  </v-app>
</template>

<script>

import {mapGetters, mapState} from "vuex";

export default {
  async created() {
    await this.$fire.auth.onAuthStateChanged(user => {
      if (user) {
        this.name = user.displayName
      }
    })
  },
  computed: {
    ...mapState({
      authUser: state => state.authUser,
    }),
    ...mapGetters({
      isLoggedIn: 'isLoggedIn',
    }),
  },
  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Home',
          to: '/'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Storage',
          to: '/storage'
        },
      ],
      miniVariant: false,
      right: true,
      title: 'Vuetify.js',
      name: null
    }
  },
  methods:{
    async logout() {
      try {
        await this.$fire.auth.signOut()
        await this.$router.push('/');
      } catch (e) {
        alert(e)
      }
    },
  }
}
</script>
