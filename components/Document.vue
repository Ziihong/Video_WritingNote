<template>
  <div>
    <div class="toggleBar">
      <p style="padding-right: 1em">Edit</p>
      <VueToggles
        @click="value = !value"
        :value="value"
        checkedText="on"
        uncheckedText="off"
        checkedBg="royalblue"
        uncheckedBg="lightgray"
      />
    </div>
    <component :is="changeMode"></component>
  </div>
</template>

<script>
import TextViewer from '@/components/TextViewer'
import TextEditor from '@/components/TextEditor'
import EventBus from '@/components/EventBus'

import Vue from 'vue';
import VueToggles from 'vue-toggles';
Vue.component('VueToggles', VueToggles);

export default{
  data(){
    return{
      value: false  //default Viewer
    }
  },


  components:{
    'TextViewer': () => import('@/components/TextViewer'),
    'TextEditor': () => import('@/components/TextEditor'),
  },

  computed:{
    changeMode(){
      switch(this.value){
        case false:
          return 'TextViewer';
        case true:
          return 'TextEditor';
      }
    }
  }
}
</script>

<style lang="scss">
.toggleBar{
  display: flex;
}
</style>
