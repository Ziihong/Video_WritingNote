
<!--
<template>
  <div>
    <Editor
      ref="toastEditor"
      initialEditType="wysiwyg"
      height="500px"
      previewStyle="vertical"
    />
    <v-btn @click="save">Save</v-btn>
  </div>
</template>

<script>

/*
install
yarn add @toast-ui/vue-editor
yarn add vue-codemirror (or codemirror)
yarn add @toast-ui/editor
*/

import { Editor } from '@toast-ui/vue-editor'
import 'codemirror/lib/codemirror.css'
import '@toast-ui/editor/dist/toastui-editor.css'

export default{
  components: {
    Editor,
  },
  methods: {
    async getContent() {
      return this.$refs.toastEditor.invoke('getMarkdown')
    },
    async save() {
      const content = this.getContent()
      console.log(content)
    },

  },
}
</script>
-->
<template>
  <div>
    <div v-if="editor" class="editBar">
      <button @click="editor.chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }">bold</button>
      <button @click="editor.chain().focus().toggleItalic().run()" :class="{ 'is-active': editor.isActive('italic') }">italic</button>
      <button @click="editor.chain().focus().toggleStrike().run()" :class="{ 'is-active': editor.isActive('strike') }">strike</button>
      <button @click="editor.chain().focus().toggleCode().run()" :class="{ 'is-active': editor.isActive('code') }">code</button>
      <button @click="editor.chain().focus().unsetAllMarks().run()">clear marks</button>
      <button @click="editor.chain().focus().clearNodes().run()">clear nodes</button>
      <button @click="editor.chain().focus().setParagraph().run()" :class="{ 'is-active': editor.isActive('paragraph') }">paragraph</button>
      <button @click="editor.chain().focus().toggleHeading({ level: 1 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }">h1</button>
      <button @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }">h2</button>
      <button @click="editor.chain().focus().toggleHeading({ level: 3 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }">h3</button>
      <button @click="editor.chain().focus().toggleHeading({ level: 4 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }">h4</button>
      <button @click="editor.chain().focus().toggleHeading({ level: 5 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 5 }) }">h5</button>
      <button @click="editor.chain().focus().toggleHeading({ level: 6 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 6 }) }">h6</button>
      <button @click="editor.chain().focus().toggleBulletList().run()" :class="{ 'is-active': editor.isActive('bulletList') }">bullet list</button>
      <button @click="editor.chain().focus().toggleOrderedList().run()" :class="{ 'is-active': editor.isActive('orderedList') }">ordered list</button>
      <button @click="editor.chain().focus().toggleCodeBlock().run()" :class="{ 'is-active': editor.isActive('codeBlock') }">code block</button>
      <button @click="editor.chain().focus().toggleBlockquote().run()" :class="{ 'is-active': editor.isActive('blockquote') }">blockquote</button>
      <button @click="editor.chain().focus().setHorizontalRule().run()">horizontal rule</button>
      <button @click="editor.chain().focus().setHardBreak().run()">hard break</button>
      <button @click="editor.chain().focus().undo().run()">undo</button>
      <button @click="editor.chain().focus().redo().run()">redo</button>
      <button @click="editor.chain().focus().toggleHighlight().run()" :class="{ 'is-active': editor.isActive('highlight') }">highlight</button>
      <button @click="editor.chain().focus().setTextAlign('left').run()" :class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }">left</button>
      <button @click="editor.chain().focus().setTextAlign('center').run()" :class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }">center</button>
      <button @click="editor.chain().focus().setTextAlign('right').run()" :class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }">right</button>
      <button @click="editor.chain().focus().setTextAlign('justify').run()" :class="{ 'is-active': editor.isActive({ textAlign: 'justify' }) }">justify</button>
      <button id="addImage" @click="addImage()">addImage</button>
    </div>
    <editor-content :editor="editor" class="editDoc"/>
    <canvas id="screenCapture" style="border: 1px solid black; width: 100%;" hidden></canvas>
  </div>
</template>

<script>
import { Editor, EditorContent } from '@tiptap/vue-2'
import StarterKit from '@tiptap/starter-kit'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Image from '@tiptap/extension-image'
import Dropcursor from '@tiptap/extension-dropcursor'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'

export default {
  components: {
    EditorContent,
  },
  data() {
    return {
      editor: null,
    }
  },
  addImage(){

  },
  mounted() {
    this.editor = new Editor({
      extensions: [
        StarterKit,
        Document,
        Paragraph,
        Text,
        Image,
        Dropcursor,
        TextAlign,
        Highlight,
      ],
    })
  },
  beforeDestroy() {
    this.editor.destroy()
  },
}
</script>

<style lang="scss">
.editBar{
  background-color: lightskyblue;
}
.editDoc{
  background-color: lightpink;
}

</style>


