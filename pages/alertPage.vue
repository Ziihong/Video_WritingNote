<template>
</template>

<script>
import apiVersions from '../static/api';
import b64 from '../static/b64';
export default {
  name: "alertPage",
  mounted() {
    this.main();
  },
  methods: {
    async main() {
      if (window.location.hash) {
        // Try to get page data from the URL if possible
        const hash = window.location.hash.slice(1);
        let params;
        try {
          params = JSON.parse(b64.decode(hash));
        } catch {
          return;
        }

        // Check that all required parameters encoded in the URL are present
        if (!("v" in params && "e" in params)) {
          return;
        }

        const api = apiVersions[params["v"]];
        // Get values for decryption
        const encrypted = b64.base64ToBinary(params["e"]);
        const salt = "s" in params ? b64.base64ToBinary(params["s"]) : null;
        const iv = "i" in params ? b64.base64ToBinary(params["i"]) : null;
        let password = prompt("Please enter the password to unlock the link.");
        // Decrypt and redirect if possible
        let url;

        try {
          url = await api.decrypt(encrypted, password, salt, iv);
        } catch {
          // Incorrect password, try until it success.
          await this.main();
        }

        // Go to decrypted url
        window.location.href = url;
      } else {
        // Otherwise redirect to the creator
        window.location.replace("");
      }
    }
  }
}
</script>

<style scoped>

</style>
