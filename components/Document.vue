<template>
  <div class="container">
    <VueToggles
      @click="value = !value"
      :value="value"
      checkedText="Edit"
      uncheckedText="View"
      checkedBg="lightblue"
      uncheckedBg="lightcoral"
    />
    <component :is="changeMode"></component>
  </div>
</template>

<script>
import TextViewer from '@/components/TextViewer'
import TextEditor from '@/components/TextEditor'

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
    'TextEditor': () => import('@/components/TextEditor')
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
