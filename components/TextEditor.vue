
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
      <v-tooltip top><template v-slot:activator="{ on, attrs }"><v-btn text icon v-bind="attrs" v-on="on" @click="setLink" :class="{ 'is-active': editor.isActive('link') }"><v-icon>mdi-link</v-icon></v-btn></template><span>Link</span></v-tooltip>
      <v-tooltip top><template v-slot:activator="{ on, attrs }"><v-btn text icon v-bind="attrs" v-on="on" @click="editor.chain().focus().unsetLink().run()" >rm</v-btn></template><span>Link Remove</span></v-tooltip>

      <v-dialog v-model="dialog" persistent max-width="30%">
        <template v-slot:activator="{ on, attrs }">
          <v-btn text icon v-bind="attrs" v-on="on">
            <v-icon>mdi-table</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span>Table</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-text-field label="row" v-model="inputRow" type="number" required></v-text-field>
                <v-text-field label="col" v-model="inputCol" type="number" required></v-text-field>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-col>
            <v-btn color="blue darken-1" text icon @click="dialog = false">Close</v-btn>
            </v-col>
            <v-col>
            <v-btn color="blue darken-1" text icon @click="createTable">Create</v-btn>
            </v-col>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-menu>
        <template #activator="{ on: onMenu }">
          <v-tooltip top>
            <template #activator="{ on: onTooltip }">
              <v-btn text icon v-on="{ ...onMenu, ...onTooltip }">Head</v-btn>
            </template>
             <span>Heading</span>
          </v-tooltip>
        </template>
        <v-list>
          <v-tooltip top><template v-slot:activator="{ on, attrs }"><v-btn text icon v-bind="attrs" v-on="on" @click="editor.chain().focus().toggleHeading({ level: 1 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"><v-icon>mdi-format-header-1</v-icon></v-btn></template><span>Heading1</span></v-tooltip>
          <v-tooltip top><template v-slot:activator="{ on, attrs }"><v-btn text icon v-bind="attrs" v-on="on" @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"><v-icon>mdi-format-header-2</v-icon></v-btn></template><span>Heading2</span></v-tooltip>
          <v-tooltip top><template v-slot:activator="{ on, attrs }"><v-btn text icon v-bind="attrs" v-on="on" @click="editor.chain().focus().toggleHeading({ level: 3 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"><v-icon>mdi-format-header-3</v-icon></v-btn></template><span>Heading3</span></v-tooltip>
          <v-tooltip top><template v-slot:activator="{ on, attrs }"><v-btn text icon v-bind="attrs" v-on="on" @click="editor.chain().focus().toggleHeading({ level: 4 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }"><v-icon>mdi-format-header-4</v-icon></v-btn></template><span>Heading4</span></v-tooltip>
          <v-tooltip top><template v-slot:activator="{ on, attrs }"><v-btn text icon v-bind="attrs" v-on="on" @click="editor.chain().focus().toggleHeading({ level: 5 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 5 }) }"><v-icon>mdi-format-header-5</v-icon></v-btn></template><span>Heading5</span></v-tooltip>
          <v-tooltip top><template v-slot:activator="{ on, attrs }"><v-btn text icon v-bind="attrs" v-on="on" @click="editor.chain().focus().toggleHeading({ level: 6 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 6 }) }"><v-icon>mdi-format-header-6</v-icon></v-btn></template><span>Heading6</span></v-tooltip>
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
      <v-tooltip top><v-dialog><template v-slot:activator="{ on, attrs }"><v-btn text icon v-bind="attrs" v-on="on" @click="editor.chain().focus().toggleHighlight().run()" :class="{ 'is-active': editor.isActive('highlight') }">table</v-btn></template></v-dialog><span>Table</span></v-tooltip>
      <v-menu>
        <template #activator="{ on: onMenu }">
          <v-tooltip top>
            <template #activator="{ on: onTooltip }">
              <v-btn text icon v-on="{ ...onMenu, ...onTooltip }">Align</v-btn>
            </template>
            <span>Align</span>
          </v-tooltip>
        </template>
        <v-list>
          <v-list-item><v-tooltip top><template v-slot:activator="{ on, attrs }"><v-btn text icon v-bind="attrs" v-on="on" @click="editor.chain().focus().setTextAlign('justify').run()" :class="{ 'is-active': editor.isActive({ textAlign: 'justify' }) }"><v-icon>mdi-format-align-justify</v-icon></v-btn></template><span>Justify</span></v-tooltip></v-list-item>
          <v-list-item><v-tooltip top><template v-slot:activator="{ on, attrs }"><v-btn text icon v-bind="attrs" v-on="on" @click="editor.chain().focus().setTextAlign('left').run()" :class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }"><v-icon>mdi-format-align-left</v-icon></v-btn></template><span>Left</span></v-tooltip></v-list-item>
          <v-list-item><v-tooltip top><template v-slot:activator="{ on, attrs }"><v-btn text icon v-bind="attrs" v-on="on" @click="editor.chain().focus().setTextAlign('center').run()" :class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }"><v-icon>mdi-format-align-center</v-icon></v-btn></template><span>Center</span></v-tooltip></v-list-item>
          <v-list-item><v-tooltip top><template v-slot:activator="{ on, attrs }"><v-btn text icon v-bind="attrs" v-on="on" @click="editor.chain().focus().setTextAlign('right').run()" :class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }"><v-icon>mdi-format-align-right</v-icon></v-btn></template><span>Right</span></v-tooltip></v-list-item>
        </v-list>
      </v-menu>
      <v-menu offset-y>
        <template #activator="{ on: onMenu }">
          <v-tooltip top>
            <template #activator="{ on: onTooltip }">
              <v-btn text icon v-on="{ ...onMenu, ...onTooltip }">Table</v-btn>
            </template>
            <span>Table</span>
          </v-tooltip>
        </template>
        <v-list>
          <v-list-item><v-tooltip top><template v-slot:activator="{ on, attrs }"><v-btn text icon v-bind="attrs" v-on="on" @click="editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()">create</v-btn></template><span>create</span></v-tooltip></v-list-item>
          <v-list-item><v-tooltip top><template v-slot:activator="{ on, attrs }"><v-btn text icon v-bind="attrs" v-on="on" @click="editor.chain().focus().addColumnBefore().run()" :disabled="!editor.can().addColumnBefore()">addCol</v-btn></template><span>addColBefore</span></v-tooltip></v-list-item>
          <v-list-item><v-tooltip top><template v-slot:activator="{ on, attrs }"><v-btn text icon v-bind="attrs" v-on="on" @click="editor.chain().focus().addColumnAfter().run()" :disabled="!editor.can().addColumnAfter()">addCol</v-btn></template><span>addColAfter</span></v-tooltip></v-list-item>
          <v-list-item><v-tooltip top><template v-slot:activator="{ on, attrs }"><v-btn text icon v-bind="attrs" v-on="on" @click="editor.chain().focus().deleteColumn().run()" :disabled="!editor.can().deleteColumn()">delCol</v-btn></template><span>delCol</span></v-tooltip></v-list-item>
          <v-list-item><v-tooltip top><template v-slot:activator="{ on, attrs }"><v-btn text icon v-bind="attrs" v-on="on" @click="editor.chain().focus().addRowBefore().run()" :disabled="!editor.can().addRowBefore()">addRow</v-btn></template><span>addRowBefore</span></v-tooltip></v-list-item>
          <v-list-item><v-tooltip top><template v-slot:activator="{ on, attrs }"><v-btn text icon v-bind="attrs" v-on="on" @click="editor.chain().focus().addRowAfter().run()" :disabled="!editor.can().addRowAfter()">addRow</v-btn></template><span>addRowAfter</span></v-tooltip></v-list-item>
          <v-list-item><v-tooltip top><template v-slot:activator="{ on, attrs }"><v-btn text icon v-bind="attrs" v-on="on" @click="editor.chain().focus().deleteRow().run()" :disabled="!editor.can().deleteRow()">delRow</v-btn></template><span>delRow</span></v-tooltip></v-list-item>
          <v-list-item><v-tooltip top><template v-slot:activator="{ on, attrs }"><v-btn text icon v-bind="attrs" v-on="on" @click="editor.chain().focus().mergeOrSplit().run()" :disabled="!editor.can().mergeOrSplit()">merge/split</v-btn></template><span>merge/split</span></v-tooltip></v-list-item>
        </v-list>
      </v-menu>

      <bubble-menu
        class="bubble-menu"
        :tippy-options="{ animation: false }"
        :editor="editor"
        v-if="editor"
        v-show="editor.isActive('custom-image')"
      >
        <button @click="editor.chain().focus().setImage({ size: 'small' }).run()" :class="{'is-active': editor.isActive('custom-image', {size: 'small'})}">Small</button>
        <button @click="editor.chain().focus().setImage({ size: 'medium' }).run()" :class="{'is-active': editor.isActive('custom-image', {size: 'medium'})}">Medium</button>
        <button @click="editor.chain().focus().setImage({ size: 'large' }).run()" :class="{'is-active': editor.isActive('custom-image', {size: 'large'})}">Large</button>
        <span style="color: #aaa">|</span>
        <button @click="editor.chain().focus().setImage({ float: 'left' }).run()" :class="{'is-active': editor.isActive('custom-image', {float: 'left'})}">Left</button>
        <button @click="editor.chain().focus().setImage({ float: 'none' }).run()" :class="{'is-active': editor.isActive('custom-image', {float: 'none'})}">No float</button>
        <button @click="editor.chain().focus().setImage({ float: 'right' }).run()" :class="{'is-active': editor.isActive('custom-image', {float: 'right'})}">Right</button>
        <span style="color: #aaa">|</span>
      </bubble-menu>

      <v-tooltip top><template v-slot:activator="{ on, attrs }"><v-btn text icon v-bind="attrs" v-on="on" @click="addImage()"><v-icon>mdi-camera-iris</v-icon></v-btn></template><span>Screenshot</span></v-tooltip>
      <v-btn style="align-self: center" @click="saveDocument">save</v-btn>
    </div>
    <editor-content :editor="editor" class="editDoc" style="border: 2px solid lightslategrey"/>
    <canvas id="screenshot" style="border: 1px solid black; width: 100%;" hidden></canvas>
  </div>
</template>

<script>
import { Editor ,EditorContent, BubbleMenu } from '@tiptap/vue-2'
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

import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import Link from '@tiptap/extension-link'
import CustomImage from 'assets/image_test'

import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
// load all highlight.js languages
import lowlight from 'lowlight'


const CustomTableCell = TableCell.extend({
  addAttributes() {
    return {
      // extend the existing attributes …
      ...this.parent?.(),

      // and add a new one …
      backgroundColor: {
        default: null,
        parseHTML: element => {
          return {
            backgroundColor: element.getAttribute('data-background-color'),
          }
        },
        renderHTML: attributes => {
          return {
            'data-background-color': attributes.backgroundColor,
            style: `background-color: ${attributes.backgroundColor}`,
          }
        },
      },
    }
  },
})

export default {
  components: {
    EditorContent,
    BubbleMenu,
  },

  data() {
    return {
      editor: null,
      dialog: false,
      inputRow: '',
      inputCol: '',
      fileDoc: '',
    }
  },

  mounted() {

    //fetchDocument 에서 불러온 데이터 content 에 설정
    this.fetchDocument();

    const test = `<p>This is <strong>some</strong> inserted text. 👋</p>`

    this.editor = new Editor({
      extensions: [
        StarterKit, Document, Paragraph, Text, Highlight, Underline, Link, CodeBlock, Image, Dropcursor, TextAlign, Typography, VTooltip, TableRow, TableHeader, CustomTableCell,
        TextAlign.configure({
          types: ['heading', 'paragraph'],
        }),
        Table.configure({
          resizable: true,
        }),
        CustomImage.configure({
          HTMLAttributes: {
            class: 'custom-image'
          }
        }),
        // CodeBlockLowlight.configure({
        //
        // }),
      ],
      content: test, // = document

    })
  },

  beforeDestroy() {
    this.editor.destroy()
  },

  methods: {
    // screenshot upload text editor
    async addImage() {
      const video = document.getElementById("currentVideo")
      let canvas = document.querySelector("#screenshot");
      const context = canvas.getContext("2d");

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const dataURL = canvas.toDataURL("image/jpg");
      this.editor.chain().focus('end').setImage({src: dataURL}).run();
    },

    // set link text editor
    setLink() {
      const url = window.prompt('URL')
      try {
        this.editor.chain().focus().extendMarkRange('link').setLink({href: url}).run()
      } catch (e) {
        console.log(e)
      }
    },

    // create table
    createTable() {
      this.dialog = false;
      if (this.inputRow <= 0 || this.inputCol <= 0) {
        return;
      }
      this.editor.chain().focus().insertTable({rows: this.inputRow, cols: this.inputCol, withHeaderRow: true}).run()
    },

    // save document in firestore
    saveDocument() {
      //const document = this.editor.getJSON()
      //const docToJson = JSON.stringify(document)
      const document = this.editor.getHTML()
      console.log(document)


      const file = this.$fire.firestore.doc(`users/${this.$fire.auth.currentUser.uid}/files/${this.$route.params.id}`)
      file.get().then( async (doc)=>{

        const self = this

        const title = doc.data().title;
        const fileTitle = title + '.html';
        const storageRef = this.$fire.storage.ref(`users/${this.$fire.auth.currentUser.uid}/${title}/${fileTitle}`)
        const uploadTask = storageRef.putString(document); // 데이터 저장

        await this.$fire.firestore.doc(`users/${this.$fire.auth.currentUser.uid}/files/${this.$route.params.id}`).update({documentSrc: uploadTask.snapshot.ref.fullPath})
      });
    },

    //fetch from firebase storage
    fetchDocument(){
      //this.editor.setContents('<p>This is <strong>some</strong> inserted text. 👋</p>');
      const file = this.$fire.firestore.doc(`users/${this.$fire.auth.currentUser.uid}/files/${this.$route.params.id}`);
      file.get().then( async (doc)=>{

        const src = doc.data().documentSrc
        const self = this;
        await Promise.resolve(self.$fire.storage.ref(src).getDownloadURL().then(result=>(this.fileDoc = result)));
        console.log(this.fileDoc);

    })
    }
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans&family=Noto+Sans+JP&family=Noto+Sans+KR&display=swap');

.editDoc{
  font-family: 'Noto Sans', sans-serif;
  font-family: 'Noto Sans KR', sans-serif;
  font-family: 'Noto Sans JP', sans-serif;
  font-weight: normal;
  text-align: justify;
  overflow-y: scroll;
  height: 30rem; //화면 크기에 따라 높이 다름.
  width: 100%;
}
.ProseMirror{
  min-height: 30rem; // 화면 크기에 따라 높이 다름.
  border: 1px solid lightslategrey;

  a {
    color: slateblue;
  }

  table {
    border-collapse: collapse;
    table-layout: fixed;
    width: 100%;
    margin: 0;
    overflow: auto;

    td,
    th {
      min-width: 1em;
      border: 2px solid #ced4da;
      padding: 3px 5px;
      vertical-align: top;
      box-sizing: border-box;
      position: relative;

      > * {
        margin-bottom: 0;
      }
    }

    th {
      font-weight: bold;
      text-align: left;
      background-color: #f1f3f5;
    }

    .selectedCell:after {
      z-index: 2;
      position: absolute;
      content: "";
      left: 0; right: 0; top: 0; bottom: 0;
      background: rgba(200, 200, 255, 0.4);
      pointer-events: none;
    }

    .column-resize-handle {
      position: absolute;
      right: -2px;
      top: 0;
      bottom: -2px;
      width: 4px;
      background-color: #adf;
      pointer-events: none;
    }
  }
}
img {
  width: 100%;
  height: auto;
  display: block;
  margin-left: auto;
  margin-right: auto;
  &.ProseMirror-selectednode {
    outline: 3px solid #68cef8;
  }
}
.custom-image-small {
  max-width: 33%;
}
.custom-image-medium {
  max-width: 50%;
}
.custom-image-large {
  max-width: 100%;
}
.custom-image-float-none {
  float: none;
}
.custom-image-float-left {
  float: left;
}
.custom-image-float-right {
  float: right;
}
.bubble-menu {
  display: flex;
  background-color: slategray;
  padding: 0.2rem;
  border-radius: 0.5rem;
  button {
    border: none;
    background: none;
    color: #fff;
    font-size: 0.85rem;
    font-weight: 500;
    padding: 0 0.2rem;
    opacity: 0.6;
    &:hover,
    &.is-active {
      opacity: 1;
    }
    &.is-active {
      text-decoration: underline;
    }
  }
}

blockquote {
  margin-left: 1rem;
  padding-left: 1rem;
  border-left: 2px solid lightgrey;
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
  }

  .hljs-comment,
  .hljs-quote {
    color: #616161;
  }

  .hljs-variable,
  .hljs-template-variable,
  .hljs-attribute,
  .hljs-tag,
  .hljs-name,
  .hljs-regexp,
  .hljs-link,
  .hljs-name,
  .hljs-selector-id,
  .hljs-selector-class {
    color: #F98181;
  }

  .hljs-number,
  .hljs-meta,
  .hljs-built_in,
  .hljs-builtin-name,
  .hljs-literal,
  .hljs-type,
  .hljs-params {
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
}


</style>
