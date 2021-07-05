
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
      <v-btn text icon @click="editor.chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }"><v-icon>mdi-format-bold</v-icon></v-btn>
      <v-btn text icon @click="editor.chain().focus().toggleItalic().run()" :class="{ 'is-active': editor.isActive('italic') }"><v-icon>mdi-format-italic</v-icon></v-btn>
      <v-btn text icon @click="editor.chain().focus().toggleStrike().run()" :class="{ 'is-active': editor.isActive('strike') }"><v-icon>mdi-format-strikethrough</v-icon></v-btn>
      <v-btn text icon @click="editor.chain().focus().toggleUnderline().run()" :class="{ 'is-active': editor.isActive('underline') }"><v-icon>mdi-format-underline</v-icon></v-btn>
      <v-btn text icon @click="editor.chain().focus().toggleCode().run()" :class="{ 'is-active': editor.isActive('code') }"><v-icon>mdi-code-tags</v-icon></v-btn>
      <v-btn text icon @click="editor.chain().focus().unsetAllMarks().run()">clear marks</v-btn>
      <v-btn text icon @click="editor.chain().focus().clearNodes().run()">clear nodes</v-btn>
      <v-btn text icon @click="editor.chain().focus().setParagraph().run()" :class="{ 'is-active': editor.isActive('paragraph') }"><v-icon>mdi-format-paragraph</v-icon></v-btn>
      <v-btn text icon @click="editor.chain().focus().toggleHeading({ level: 1 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"><v-icon>mdi-format-header-1</v-icon></v-btn>
      <v-btn text icon @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"><v-icon>mdi-format-header-2</v-icon></v-btn>
      <v-btn text icon @click="editor.chain().focus().toggleHeading({ level: 3 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"><v-icon>mdi-format-header-3</v-icon></v-btn>
      <v-btn text icon @click="editor.chain().focus().toggleHeading({ level: 4 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }"><v-icon>mdi-format-header-4</v-icon></v-btn>
      <v-btn text icon @click="editor.chain().focus().toggleHeading({ level: 5 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 5 }) }"><v-icon>mdi-format-header-5</v-icon></v-btn>
      <v-btn text icon @click="editor.chain().focus().toggleHeading({ level: 6 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 6 }) }"><v-icon>mdi-format-header-6</v-icon></v-btn>
      <v-btn text icon @click="editor.chain().focus().toggleBulletList().run()" :class="{ 'is-active': editor.isActive('bulletList') }"><v-icon>mdi-format-list-bulleted</v-icon></v-btn>
      <v-btn text icon @click="editor.chain().focus().toggleOrderedList().run()" :class="{ 'is-active': editor.isActive('orderedList') }"><v-icon>mdi-format-list-numbered</v-icon></v-btn>
      <v-btn text icon @click="editor.chain().focus().toggleCodeBlock().run()" :class="{ 'is-active': editor.isActive('codeBlock') }">code block</v-btn>
      <v-btn text icon @click="editor.chain().focus().toggleBlockquote().run()" :class="{ 'is-active': editor.isActive('blockquote') }"><v-icon>mdi-format-quote-close</v-icon></v-btn>
      <v-btn text icon @click="editor.chain().focus().setHorizontalRule().run()"><v-icon>mdi-minus</v-icon></v-btn>
      <v-btn text icon @click="editor.chain().focus().setHardBreak().run()">hard break</v-btn>
      <v-btn text icon @click="editor.chain().focus().undo().run()"><v-icon>mdi-undo</v-icon></v-btn>
      <v-btn text icon @click="editor.chain().focus().redo().run()"><v-icon>mdi-redo</v-icon></v-btn>
      <v-btn text icon @click="editor.chain().focus().toggleHighlight().run()" :class="{ 'is-active': editor.isActive('highlight') }"><v-icon>mdi-marker</v-icon></v-btn>
      <v-btn text icon @click="editor.chain().focus().setTextAlign('left').run()" :class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }"><v-icon>mdi-format-align-left</v-icon></v-btn>
      <v-btn text icon @click="editor.chain().focus().setTextAlign('center').run()" :class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }"><v-icon>mdi-format-align-center</v-icon></v-btn>
      <v-btn text icon @click="editor.chain().focus().setTextAlign('right').run()" :class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }"><v-icon>mdi-format-align-right</v-icon></v-btn>
      <v-btn text icon @click="editor.chain().focus().setTextAlign('justify').run()" :class="{ 'is-active': editor.isActive({ textAlign: 'justify' }) }"><v-icon>mdi-format-align-justify</v-icon></v-btn>
      <v-btn text icon id="addImage" @click="addImage()"><v-icon>mdi-monitor-screenshot</v-icon></v-btn>
    </div>
    <editor-content :editor="editor" class="editDoc"/>
    <canvas id="screenshot" style="border: 1px solid black; width: 100%;" hidden></canvas>

<!--    tooltip test-->
    <v-tooltip v-bind="$attrs">
      <template v-slot:activator="{ on, attrs }">
        <v-icon v-on="on" v-bind="attrs" style="padding:0 10px;">
          mdi-minus
        </v-icon>
      </template>
      <span> title<br />content </span>
    </v-tooltip>
<!--    tooltip test-->

    <v-btn @click="saveComment">save</v-btn>
  </div>
</template>

<script>
import { Editor ,EditorContent } from '@tiptap/vue-2'
import StarterKit from '@tiptap/starter-kit'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Image from '@tiptap/extension-image'
import Dropcursor from '@tiptap/extension-dropcursor'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import Underline from '@tiptap/extension-underline'
import VTooltip from 'v-tooltip'

export default {
  components: {
    EditorContent,
  },
  data() {
    return {
      editor: null,
      temps: [],
    }
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
        Underline,
        VTooltip,
        TextAlign.configure({
          types: ['heading', 'paragraph'],
        }),
      ],
    })
  },
  beforeDestroy() {
    this.editor.destroy()
  },
  methods: {
    async addImage(){
      const video = document.getElementById("currentVideo")
      let canvas = document.querySelector("#screenshot");
      const context = canvas.getContext("2d");

      canvas.width = 300
      canvas.height = 150

      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const dataURL = canvas.toDataURL("image/jpg");
      await this.editor.chain().focus().setImage({src: dataURL}).run()
      this.editor.chain().focus()

      this.temps.push();
      console.log(this.temps.length);

      let addBtn = document.getElementById('addImage');
      try{
        addBtn.classList.remove("ProseMirror ProseMirror-focused")
      }
      catch (e){
        console.log(e)
      }
      addBtn.onclick = (event) => {
        console.log(event)
      }
    },
    saveComment(){
      //this.editor.getJSON()
      //this.editor.getHTML()
    },
  }
}
</script>

<style>
.ProseMirror:focus {
  outline: none;
}
</style>
