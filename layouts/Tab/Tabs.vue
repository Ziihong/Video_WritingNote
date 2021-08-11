<template>
  <div>
    <ul class='tabHeader'>
      <li v-for='(tab, index) in tabs'
          :key='tab.title'
          @click='selectTab(index)'
          :class='{"tabSelected": (index === selectedIndex)}'>
        {{ tab.title }}
      </li>
    </ul>
    <slot></slot>
  </div>
</template>

<script>
import EventBus from '@/components/EventBus'

export default {

  data () {
    return {
      selectedIndex: 0, // the index of the selected tab,
      tabs: []         // all of the tabs
    }
  },
  created () {
    this.tabs = this.$children
  },
  mounted () {
    this.selectTab(this.selectedIndex)
  },
  methods: {
    selectTab (i) {
      this.selectedIndex = i
      try{
        if(this.selectedIndex === 1){   // === Viewer
          EventBus.$emit('clickViewer');
        }
      }
      catch (e){
        console.log(e);
      }
      this.tabs.forEach((tab, index) => {
        tab.isActive = (index === i)
      })
    }
  }
}
</script>

<style lang="css">
.tabHeader {
  display: block;
  list-style: none;
  margin: 0 0 0 20px;
  padding: 0;
}
ul.tabHeader > li {
  padding: 10px 10px;
  border-radius: 10px;
  margin: 0;
  display: inline-block;
  cursor: pointer;
}
ul > li.tabSelected {
  font-weight: bold;
  border-radius: 10px 10px 0 0;
  border-bottom: 8px solid transparent;
  background: lightblue;
}

</style>
