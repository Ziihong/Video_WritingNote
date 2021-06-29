<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <div class="text-center">
        <logo/>
        <vuetify-logo/>
      </div>
      <h2>AUTH Example</h2>
      <div style="margin: 40px 0">
        <client-only>
          <Codeblock>
        <pre>
async createUser() {
  try {
    await this.$fire.auth.createUserWithEmailAndPassword('foo@foo.foo', 'test')
  } catch (e) {
    alert(e)
  }
}
        </pre>
          </Codeblock>
        </client-only>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import Logo from '~/components/Logo.vue';
import VuetifyLogo from '~/components/VuetifyLogo.vue';
import Auth from '~/components/Auth';

export default {
  components: {
    Logo,
    VuetifyLogo,
    Auth,
  },
  data() {
    return {}
  }
};
</script>
