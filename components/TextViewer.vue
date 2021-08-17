
<template>
  <div>
    <editor-content :editor="editor" class="viewDoc"/>
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
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import Underline from '@tiptap/extension-underline'
import Typography from '@tiptap/extension-typography'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import Link from '@tiptap/extension-link'
import CustomImage from '~/middleware/customImage'
import EventBus from '@/components/EventBus'

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
  },

  data() {
    return {
      editor: null,
      dialog: false,
    }
  },

  mounted() {
    this.fetchDocument();

    this.editor = new Editor({
      extensions: [
        StarterKit, Document, Paragraph, Text, Highlight, Underline, Link, CodeBlock, Image, TextAlign, Typography, TableRow, TableHeader, CustomTableCell,
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
      ],
      editable: false,
    })
  },

  beforeDestroy() {
    this.editor.destroy()
  },

  methods: {

    //fetch document from firebase storage
    async fetchDocument() {

      const file = this.$fire.firestore.doc(`users/${this.$fire.auth.currentUser.uid}/files/${this.$route.params.id}`);
      file.get().then(async (doc) => {

        const src = doc.data().documentSrc
        const self = this;
        const xhr = new XMLHttpRequest()
        const fr = new FileReader();

        try {
          await Promise.resolve(self.$fire.storage.ref(src).getDownloadURL().then(result => {
            xhr.responseType = "blob";
            xhr.onload = function (event) {
              let blob = xhr.response;
              fr.readAsText(blob)
            }
            xhr.open("GET", result, true);
            xhr.send(null);
          }));

          fr.addEventListener("load", (e) => {
            const fetch = JSON.parse(fr.result)
            this.editor.commands.setContent(fetch)
          });
        }catch (e){
          console.log("There is no saved document.")
        }
      })
    },
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans&family=Noto+Sans+JP&family=Noto+Sans+KR&display=swap');

.viewDoc{
  font-family: sans-serif;
  overflow-y: scroll;
  height: 35rem; // 화면 크기에 따라 높이 다름.
  width: 100%;
  border: 1px solid lightslategrey;
  border-radius: 10px;
}

.ProseMirror{
  min-height: 35rem; // 화면 크기에 따라 높이 다름.
  padding: 1em;
  outline: none;

  a {
    color: slateblue;
  }

  table {
    border-collapse: collapse;
    table-layout: fixed;
    width: 100%;
    margin-top: 0.5em;
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

  &.ProseMirror-selectednode{
    outline: none;
  }
}
.custom-image-small {
  max-width: 32%;
}
.custom-image-medium {
  max-width: 49%;
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
}
</style>
