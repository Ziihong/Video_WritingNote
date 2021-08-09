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
export default {
  props: {
    mode: {
      type: String,
    }
  },
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
      // loop over all the tabs
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
ul> li {
  padding: 15px 30px;
  border-radius: 10px;
  margin: 0;
  display: inline-block;
  margin-right: 5px;
  cursor: pointer;
}
ul > li.tabSelected {
  font-weight: bold;
  border-radius: 10px 10px 0 0;
  border-bottom: 8px solid transparent;
  background: lightblue;
}

</style>
