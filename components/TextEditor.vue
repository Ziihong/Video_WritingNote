
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
    <div v-if="editor" class="editBar" style="border: 2px solid lightgray">
      <v-tooltip top><template v-slot:activator="{ on, attrs }"><v-btn text icon v-bind="attrs" v-on="on" @click="editor.chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }"><v-icon>mdi-format-bold</v-icon></v-btn></template><span>Bold</span></v-tooltip>
      <v-tooltip top><template v-slot:activator="{ on, attrs }"><v-btn text icon v-bind="attrs" v-on="on" @click="editor.chain().focus().toggleItalic().run()" :class="{ 'is-active': editor.isActive('italic') }"><v-icon>mdi-format-italic</v-icon></v-btn></template><span>Italic</span></v-tooltip>
      <v-tooltip top><template v-slot:activator="{ on, attrs }"><v-btn text icon v-bind="attrs" v-on="on" @click="editor.chain().focus().toggleStrike().run()" :class="{ 'is-active': editor.isActive('strike') }"><v-icon>mdi-format-strikethrough</v-icon></v-btn></template><span>Strike</span></v-tooltip>
      <v-tooltip top><template v-slot:activator="{ on, attrs }"><v-btn text icon v-bind="attrs" v-on="on" @click="editor.chain().focus().toggleUnderline().run()" :class="{ 'is-active': editor.isActive('underline') }"><v-icon>mdi-format-underline</v-icon></v-btn></template><span>Underline</span></v-tooltip>
      <v-tooltip top><template v-slot:activator="{ on, attrs }"><v-btn text icon v-bind="attrs" v-on="on" @click="editor.chain().focus().toggleCode().run()" :class="{ 'is-active': editor.isActive('code') }"><v-icon>mdi-code-tags</v-icon></v-btn></template><span>Code</span></v-tooltip>
      <v-tooltip top><template v-slot:activator="{ on, attrs }"><v-btn text icon v-bind="attrs" v-on="on" @click="editor.chain().focus().unsetAllMarks().run()">cm</v-btn></template><span>Clear marks</span></v-tooltip>
      <v-tooltip top><template v-slot:activator="{ on, attrs }"><v-btn text icon v-bind="attrs" v-on="on" @click="editor.chain().focus().clearNodes().run()">cn</v-btn></template><span>Clear nodes</span></v-tooltip>
      <v-tooltip top><template v-slot:activator="{ on, attrs }"><v-btn text icon v-bind="attrs" v-on="on" @click="editor.chain().focus().setParagraph().run()" :class="{ 'is-active': editor.isActive('paragraph') }"><v-icon>mdi-format-pilcrow</v-icon></v-btn></template><span>Paragraph</span></v-tooltip>
      <v-menu offset-x>
        <template v-slot:activator="{ on, attrs }">
          <v-btn text icon v-bind="attrs" v-on="on">Head</v-btn>
        </template>
        <v-list>
          <v-btn text icon @click="editor.chain().focus().toggleHeading({ level: 1 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"><v-icon>mdi-format-header-1</v-icon></v-btn>
          <v-btn text icon @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"><v-icon>mdi-format-header-2</v-icon></v-btn>
          <v-btn text icon @click="editor.chain().focus().toggleHeading({ level: 3 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"><v-icon>mdi-format-header-3</v-icon></v-btn>
          <v-btn text icon @click="editor.chain().focus().toggleHeading({ level: 4 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }"><v-icon>mdi-format-header-4</v-icon></v-btn>
          <v-btn text icon @click="editor.chain().focus().toggleHeading({ level: 5 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 5 }) }"><v-icon>mdi-format-header-5</v-icon></v-btn>
          <v-btn text icon @click="editor.chain().focus().toggleHeading({ level: 6 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 6 }) }"><v-icon>mdi-format-header-6</v-icon></v-btn>
        </v-list>
      </v-menu>
      <v-tooltip top><template v-slot:activator="{ on, attrs }"><v-btn text icon v-bind="attrs" v-on="on" @click="editor.chain().focus().toggleBulletList().run()" :class="{ 'is-active': editor.isActive('bulletList') }"><v-icon>mdi-format-list-bulleted</v-icon></v-btn></template><span>Bullet List</span></v-tooltip>
      <v-tooltip top><template v-slot:activator="{ on, attrs }"><v-btn text icon v-bind="attrs" v-on="on" @click="editor.chain().focus().toggleOrderedList().run()" :class="{ 'is-active': editor.isActive('orderedList') }"><v-icon>mdi-format-list-numbered</v-icon></v-btn></template><span>Number List</span></v-tooltip>
      <v-tooltip top><template v-slot:activator="{ on, attrs }"><v-btn text icon v-bind="attrs" v-on="on" @click="editor.chain().focus().toggleCodeBlock().run()" :class="{ 'is-active': editor.isActive('codeBlock') }">CB</v-btn></template><span>Code Block</span></v-tooltip>
      <v-tooltip top><template v-slot:activator="{ on, attrs }"><v-btn text icon v-bind="attrs" v-on="on" @click="editor.chain().focus().toggleBlockquote().run()" :class="{ 'is-active': editor.isActive('blockquote') }"><v-icon>mdi-format-quote-close</v-icon></v-btn></template><span>Block Quote</span></v-tooltip>
      <v-tooltip top><template v-slot:activator="{ on, attrs }"><v-btn text icon v-bind="attrs" v-on="on" @click="editor.chain().focus().setHorizontalRule().run()"><v-icon>mdi-minus</v-icon></v-btn></template><span>Horizontal line</span></v-tooltip>
      <v-tooltip top><template v-slot:activator="{ on, attrs }"><v-btn text icon v-bind="attrs" v-on="on" @click="editor.chain().focus().setHardBreak().run()">HB</v-btn></template><span>Hard Break</span></v-tooltip>
      <v-tooltip top><template v-slot:activator="{ on, attrs }"><v-btn text icon v-bind="attrs" v-on="on" @click="editor.chain().focus().undo().run()"><v-icon>mdi-undo</v-icon></v-btn></template><span>Undo</span></v-tooltip>
      <v-tooltip top><template v-slot:activator="{ on, attrs }"><v-btn text icon v-bind="attrs" v-on="on" @click="editor.chain().focus().redo().run()"><v-icon>mdi-redo</v-icon></v-btn></template><span>Redo</span></v-tooltip>
      <v-tooltip top><template v-slot:activator="{ on, attrs }"><v-btn text icon v-bind="attrs" v-on="on" @click="editor.chain().focus().toggleHighlight().run()" :class="{ 'is-active': editor.isActive('highlight') }"><v-icon>mdi-marker</v-icon></v-btn></template><span>Highlight</span></v-tooltip>
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn text icon v-bind="attrs" v-on="on">Align</v-btn>
        </template>
        <v-list>
          <v-list-item><v-btn text icon @click="editor.chain().focus().setTextAlign('justify').run()" :class="{ 'is-active': editor.isActive({ textAlign: 'justify' }) }"><v-icon>mdi-format-align-justify</v-icon></v-btn></v-list-item>
          <v-list-item><v-btn text icon @click="editor.chain().focus().setTextAlign('left').run()" :class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }"><v-icon>mdi-format-align-left</v-icon></v-btn></v-list-item>
          <v-list-item><v-btn text icon @click="editor.chain().focus().setTextAlign('center').run()" :class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }"><v-icon>mdi-format-align-center</v-icon></v-btn></v-list-item>
          <v-list-item><v-btn text icon @click="editor.chain().focus().setTextAlign('right').run()" :class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }"><v-icon>mdi-format-align-right</v-icon></v-btn></v-list-item>
        </v-list>
      </v-menu>
      <v-tooltip top><template v-slot:activator="{ on, attrs }"><v-btn text icon v-bind="attrs" v-on="on" @click="addImage()"><v-icon>mdi-camera-iris</v-icon></v-btn></template><span>Screenshot</span></v-tooltip>
    </div>
    <editor-content :editor="editor" class="editDoc" style="border: 2px solid lightslategrey"/>
    <canvas id="screenshot" style="border: 1px solid black; width: 100%;" hidden></canvas>
    <v-btn style="align-self: center" @click="saveComment">save</v-btn>
  </div>
</template>

<script>
import { Editor ,EditorContent } from '@tiptap/vue-2'
import StarterKit from '@tiptap/starter-kit'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import CodeBlock from '@tiptap/extension-code-block'
import Image from '@tiptap/extension-image'
import Dropcursor from '@tiptap/extension-dropcursor'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import Underline from '@tiptap/extension-underline'
import VTooltip from 'v-tooltip'
import Typography from '@tiptap/extension-typography'

// import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
// // load all highlight.js languages
// import lowlight from 'lowlight'

import VueHighlightJS from 'vue-highlightjs'
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
        CodeBlock,
        Image,
        Dropcursor,
        TextAlign,
        Highlight,
        Underline,
        Typography,
        VueHighlightJS,
        VTooltip,
        TextAlign.configure({
          types: ['heading', 'paragraph'],
        }),

      ],
      content: ``,
    })
  },

  beforeDestroy() {
    this.editor.destroy()
  },

  methods: {
    // screenshot upload text editor
    async addImage(){
      const video = document.getElementById("currentVideo")
      let canvas = document.querySelector("#screenshot");
      const context = canvas.getContext("2d");

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const dataURL = canvas.toDataURL("image/jpg");
      this.editor.chain().focus('end').setImage({src: dataURL}).run()

    },

    // comment save in firestore
    saveComment(){
      //this.editor.getJSON()
    },

  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans&family=Noto+Sans+JP&family=Noto+Sans+KR&display=swap');

.editDoc{
  font-family: 'Noto Sans', sans-serif;
  font-family: 'Noto Sans JP', sans-serif;
  font-family: 'Noto Sans KR', sans-serif;
}
.ProseMirror{
  min-height: 30em;
  border: 1px solid lightslategrey;
}
img {
  max-width: 100%;
  height: auto;
}
pre {
  background: #0D0D0D;
  color: #FFF;
  font-family: 'JetBrainsMono', monospace;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;

  code {
    color: inherit;
    padding: 0;
    background: none;
    font-size: 0.8rem;
  },
  /*
  .highlight-comment,
  .highlight-quote {
    color: #616161;
  }

  .highlight-variable,
  .highlight-template-variable,
  .highlight-attribute,
  .highlight-tag,
  .highlight-name,
  .highlight-regexp,
  .highlight-link,
  .highlight-name,
  .highlight-selector-id,
  .highlight-selector-class {
    color: #F98181;
  }

  .highlightjs-number,
  .highlight-meta,
  .highlight-built_in,
  .highlight-builtin-name,
  .highlight-literal,
  .highlight-type,
  .highlight-params {
    color: #FBBC88;
  }

  .hljs-string,
  .hljs-symbol,
  .hljs-bullet {
    color: #B9F18D;
  }

  .hljs-title,
  .hljs-section {
    color: #FAF594;
  }

  .hljs-keyword,
  .hljs-selector-tag {
    color: #70CFF8;
  }

  .hljs-emphasis {
    font-style: italic;
  }

  .hljs-strong {
    font-weight: 700;
  }
  */
}

</style>
