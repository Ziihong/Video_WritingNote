<template>
  <table border="1" class="table" width="auto" v-columns-resizable>
    <thead >
    <tr>
      <th ></th>
      <th  rowspan="2" ></th>
    </tr>
    <tr>
      <th></th>
    </tr>
    </thead>
    <tbody >
    <tr>
      <td>video</td>
      <td rowspan="2" >document</td>
    </tr>
    <tr>
      <td>bookmark</td>
    </tr>
    </tbody>
  </table>
</template>

<script>

import Vue from 'vue'
import VueColumnsResizable from 'vue-columns-resizable'
Vue.use(VueColumnsResizable)

export default {
  name: "test.vue"
}
</script>

<style scoped>

</style>
