<template lang="html">
  <div class='wrapper'>
    <Tabs>
      <TabItem title="Editor"><TextEditor/></TabItem>
      <TabItem title="Viewer"><TextViewer/></TabItem>
    </Tabs>
  </div>
</template>

<script>
import TabItem from '../layouts/Tab/TabItem.vue'
import Tabs from '../layouts/Tab/Tabs.vue'
import TextEditor from '@/components/TextEditor'
import TextViewer from '@/components/TextViewer'

export default {
  components: {
    TabItem,
    Tabs,
    TextViewer,
    TextEditor,
  },
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
  border-radius: 5px;
}

</style>
