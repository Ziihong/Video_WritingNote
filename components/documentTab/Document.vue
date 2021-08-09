<template lang="html">
  <div class='wrapper'>
    <Tabs :mode="mode">
      <TabItem title="Editor"><TextEditor/></TabItem>
      <TabItem title="Viewer"><TextViewer/></TabItem>
    </Tabs>
  </div>
</template>

<script>
import TabItem from './TabItem.vue'
import Tabs from './Tabs.vue'
import TextEditor from '@/components/TextEditor'
import TextViewer from '@/components/TextViewer'
export default {
  components: {
    TabItem,
    Tabs,
    TextViewer,
    TextEditor,
  },
  data () {
    return {
      mode: 'dark'
    }
  },
  methods: {

  }
}
</script>

<style lang="css">
* {
  margin: 0;
  padding: 0;
  font-family: 'Karla', sans-serif;
}
.wrapper {
  width: 100%;
  min-height: 300vh;
}

</style>
