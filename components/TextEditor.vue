
<template>
  <div>
<!--
    <div v-if="editor" class="editBar" style="border: 1px solid lightslategrey">
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
        <template #activator="{ on: dialog }">
          <v-tooltip top>
            <template #activator="{ on: tooltip }">
              <v-btn text icon v-on="{ ...tooltip, ...dialog }">
                <v-icon>mdi-table</v-icon>
              </v-btn>
            </template>
            <span>Table</span>
          </v-tooltip>
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
      <v-tooltip top><v-dialog><template v-slot:activator="{ on, attrs }"><v-btn text icon v-bind="attrs" v-on="on" @click="editor.chain().focus().toggleHighlight().run()" :class="{ 'is-active': editor.isActive('table') }">table</v-btn></template></v-dialog><span>Table</span></v-tooltip>
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
        <button @click="editor.chain().focus().setImage({ float: 'none' }).run()" :class="{'is-active': editor.isActive('custom-image', {float: 'none'})}">Center</button>
        <button @click="editor.chain().focus().setImage({ float: 'right' }).run()" :class="{'is-active': editor.isActive('custom-image', {float: 'right'})}">Right</button>
      </bubble-menu>

      <v-tooltip top><template v-slot:activator="{ on, attrs }"><v-btn text icon v-bind="attrs" v-on="on" @click="addImage()" :class="{'is-active': editor.isActive('custom-image')}"><v-icon>mdi-camera-iris</v-icon></v-btn></template><span>Screenshot</span></v-tooltip>
      <v-btn style="align-self: center" @click="saveDocument">save</v-btn>
    </div>
-->

<!--    img button -->
    <div v-if="editor" class="editBar" style="border: 1px solid lightslategrey">
      <v-tooltip top><template v-slot:activator="{ on, attrs }"><v-btn icon v-bind="attrs" v-on="on" @click="editor.chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }"><img class="editor_menu" src="../static/editorMenu_icon/bold.svg" alt="bold"></v-btn></template><span>Bold</span></v-tooltip>
      <v-tooltip top><template v-slot:activator="{ on, attrs }"><v-btn icon v-bind="attrs" v-on="on" @click="editor.chain().focus().toggleItalic().run()" :class="{ 'is-active': editor.isActive('italic') }"><img class="editor_menu" src="../static/editorMenu_icon/italic.svg" alt="italic"></v-btn></template><span>Italic</span></v-tooltip>
      <v-tooltip top><template v-slot:activator="{ on, attrs }"><v-btn icon v-bind="attrs" v-on="on" @click="editor.chain().focus().toggleStrike().run()" :class="{ 'is-active': editor.isActive('strike') }"><img class="editor_menu" src="../static/editorMenu_icon/strikethrough.svg" alt="strike"></v-btn></template><span>Strike</span></v-tooltip>
      <v-tooltip top><template v-slot:activator="{ on, attrs }"><v-btn icon v-bind="attrs" v-on="on" @click="editor.chain().focus().toggleUnderline().run()" :class="{ 'is-active': editor.isActive('underline') }"><img class="editor_menu" src="../static/editorMenu_icon/underline.svg" alt="underline"></v-btn></template><span>Underline</span></v-tooltip>
      <v-tooltip top><template v-slot:activator="{ on, attrs }"><v-btn icon v-bind="attrs" v-on="on" @click="editor.chain().focus().toggleHighlight().run()" :class="{ 'is-active': editor.isActive('highlight') }"><img class="editor_menu" src="../static/editorMenu_icon/mark-pen-line.svg" alt="highlight"></v-btn></template><span>Highlight</span></v-tooltip>
      <v-tooltip top><template v-slot:activator="{ on, attrs }"><v-btn icon v-bind="attrs" v-on="on" @click="editor.chain().focus().setParagraph().run()" :class="{ 'is-active': editor.isActive('paragraph') }"><img class="editor_menu" src="../static/editorMenu_icon/paragraph.svg" alt="paragraph"></v-btn></template><span>Paragraph</span></v-tooltip>
      <v-tooltip top><template v-slot:activator="{ on, attrs }"><v-btn icon v-bind="attrs" v-on="on" @click="setLink" :class="{ 'is-active': editor.isActive('link') }"><img class="editor_menu" src="../static/editorMenu_icon/link.svg" alt="link"></v-btn></template><span>Link</span></v-tooltip>


      <v-menu>
        <template #activator="{ on: onMenu }">
          <v-tooltip top>
            <template #activator="{ on: onTooltip }">
              <v-btn icon v-on="{ ...onMenu, ...onTooltip }">
                <img class="editor_menu" src="../static/editorMenu_icon/heading.svg" alt="heading">
              </v-btn>
            </template>
            <span>Heading</span>
          </v-tooltip>
        </template>
        <v-list>
          <v-tooltip top><template v-slot:activator="{ on, attrs }"><v-btn icon v-bind="attrs" v-on="on" @click="editor.chain().focus().toggleHeading({ level: 1 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"><img class="editor_menu" src="../static/editorMenu_icon/h-1.svg" alt="heading1"></v-btn></template><span>Heading1</span></v-tooltip>
          <v-tooltip top><template v-slot:activator="{ on, attrs }"><v-btn icon v-bind="attrs" v-on="on" @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"><img class="editor_menu" src="../static/editorMenu_icon/h-2.svg" alt="heading2"></v-btn></template><span>Heading2</span></v-tooltip>
          <v-tooltip top><template v-slot:activator="{ on, attrs }"><v-btn icon v-bind="attrs" v-on="on" @click="editor.chain().focus().toggleHeading({ level: 3 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"><img class="editor_menu" src="../static/editorMenu_icon/h-3.svg" alt="heading3"></v-btn></template><span>Heading3</span></v-tooltip>
          <v-tooltip top><template v-slot:activator="{ on, attrs }"><v-btn icon v-bind="attrs" v-on="on" @click="editor.chain().focus().toggleHeading({ level: 4 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }"><img class="editor_menu" src="../static/editorMenu_icon/h-4.svg" alt="heading4"></v-btn></template><span>Heading4</span></v-tooltip>
          <v-tooltip top><template v-slot:activator="{ on, attrs }"><v-btn icon v-bind="attrs" v-on="on" @click="editor.chain().focus().toggleHeading({ level: 5 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 5 }) }"><img class="editor_menu" src="../static/editorMenu_icon/h-5.svg" alt="heading5"></v-btn></template><span>Heading5</span></v-tooltip>
          <v-tooltip top><template v-slot:activator="{ on, attrs }"><v-btn icon v-bind="attrs" v-on="on" @click="editor.chain().focus().toggleHeading({ level: 6 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 6 }) }"><img class="editor_menu" src="../static/editorMenu_icon/h-6.svg" alt="heading6"></v-btn></template><span>Heading6</span></v-tooltip>
        </v-list>
      </v-menu>

      <v-menu>
        <template #activator="{ on: onMenu }">
          <v-tooltip top>
            <template #activator="{ on: onTooltip }">
              <v-btn icon v-on="{ ...onMenu, ...onTooltip }"><img class="editor_menu" src="../static/editorMenu_icon/align-justify.svg" alt="align-justify"></v-btn>
            </template>
            <span>Align</span>
          </v-tooltip>
        </template>
        <v-list>
          <v-list-item><v-tooltip top><template v-slot:activator="{ on, attrs }"><v-btn icon v-bind="attrs" v-on="on" @click="editor.chain().focus().setTextAlign('justify').run()" :class="{ 'is-active': editor.isActive({ textAlign: 'justify' }) }"><img class="editor_menu" src="../static/editorMenu_icon/align-justify.svg" alt="align-justify"></v-btn></template><span>Justify</span></v-tooltip></v-list-item>
          <v-list-item><v-tooltip top><template v-slot:activator="{ on, attrs }"><v-btn icon v-bind="attrs" v-on="on" @click="editor.chain().focus().setTextAlign('left').run()" :class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }"><img class="editor_menu" src="../static/editorMenu_icon/align-left.svg" alt="align-left"></v-btn></template><span>Left</span></v-tooltip></v-list-item>
          <v-list-item><v-tooltip top><template v-slot:activator="{ on, attrs }"><v-btn icon v-bind="attrs" v-on="on" @click="editor.chain().focus().setTextAlign('center').run()" :class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }"><img class="editor_menu" src="../static/editorMenu_icon/align-center.svg" alt="align-center"></v-btn></template><span>Center</span></v-tooltip></v-list-item>
          <v-list-item><v-tooltip top><template v-slot:activator="{ on, attrs }"><v-btn icon v-bind="attrs" v-on="on" @click="editor.chain().focus().setTextAlign('right').run()" :class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }"><img class="editor_menu" src="../static/editorMenu_icon/align-right.svg" alt="align-right"></v-btn></template><span>Right</span></v-tooltip></v-list-item>
        </v-list>
      </v-menu>

      <v-tooltip top><template v-slot:activator="{ on, attrs }"><v-btn icon v-bind="attrs" v-on="on" @click="editor.chain().focus().toggleBulletList().run()" :class="{ 'is-active': editor.isActive('bulletList') }"><img class="editor_menu" src="../static/editorMenu_icon/list-unordered.svg" alt="unordered list"></v-btn></template><span>Unordered List</span></v-tooltip>
      <v-tooltip top><template v-slot:activator="{ on, attrs }"><v-btn icon v-bind="attrs" v-on="on" @click="editor.chain().focus().toggleOrderedList().run()" :class="{ 'is-active': editor.isActive('orderedList') }"><img class="editor_menu" src="../static/editorMenu_icon/list-ordered.svg" alt="ordered list"></v-btn></template><span>Ordered List</span></v-tooltip>
      <v-tooltip top><template v-slot:activator="{ on, attrs }"><v-btn icon v-bind="attrs" v-on="on" @click="editor.chain().focus().toggleCode().run()" :class="{ 'is-active': editor.isActive('code') }"><img class="editor_menu" src="../static/editorMenu_icon/code-line.svg" alt="code"></v-btn></template><span>Code</span></v-tooltip>
      <v-tooltip top><template v-slot:activator="{ on, attrs }"><v-btn icon v-bind="attrs" v-on="on" @click="editor.chain().focus().toggleCodeBlock().run()" :class="{ 'is-active': editor.isActive('codeBlock') }"><img class="editor_menu" src="../static/editorMenu_icon/code-box-line.svg" alt="code block"></v-btn></template><span>Code Block</span></v-tooltip>
      <v-tooltip top><template v-slot:activator="{ on, attrs }"><v-btn icon v-bind="attrs" v-on="on" @click="editor.chain().focus().toggleBlockquote().run()" :class="{ 'is-active': editor.isActive('blockquote') }"><img class="editor_menu" src="../static/editorMenu_icon/double-quotes-l.svg" alt="block quote"></v-btn></template><span>Block Quote</span></v-tooltip>
      <v-tooltip top><template v-slot:activator="{ on, attrs }"><v-btn icon v-bind="attrs" v-on="on" @click="editor.chain().focus().setHorizontalRule().run()"><img class="editor_menu" src="../static/editorMenu_icon/horizontal_line.svg" alt="horizontal line"></v-btn></template><span>Horizontal line</span></v-tooltip>
      <v-tooltip top><template v-slot:activator="{ on, attrs }"><v-btn icon v-bind="attrs" v-on="on" @click="editor.chain().focus().undo().run()"><img class="editor_menu" src="../static/editorMenu_icon/arrow-go-back-line.svg" alt="undo"></v-btn></template><span>Undo</span></v-tooltip>
      <v-tooltip top><template v-slot:activator="{ on, attrs }"><v-btn icon v-bind="attrs" v-on="on" @click="editor.chain().focus().redo().run()"><img class="editor_menu" src="../static/editorMenu_icon/arrow-go-forward-line.svg" alt="redo"></v-btn></template><span>Redo</span></v-tooltip>

      <v-dialog v-model="dialog" persistent max-width="30%">
        <template #activator="{ on: dialog }">
          <v-tooltip top>
            <template #activator="{ on: tooltip }">
              <v-btn icon v-on="{ ...tooltip, ...dialog }">
                <img class="editor_menu" src="../static/editorMenu_icon/table-2.svg" alt="table">
              </v-btn>
            </template>
            <span>Table</span>
          </v-tooltip>
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
              <v-btn color="blue darken-1" icon @click="dialog = false">Close</v-btn>
            </v-col>
            <v-col>
              <v-btn color="blue darken-1" icon @click="createTable">Create</v-btn>
            </v-col>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-tooltip top><template v-slot:activator="{ on, attrs }"><v-btn icon v-bind="attrs" v-on="on" @click="addImage()" :class="{'is-active': editor.isActive('custom-image')}"><img class="editor_menu" src="../static/editorMenu_icon/camera-lens-fill.svg" alt="capture"></v-btn></template><span>Screenshot</span></v-tooltip>
      <v-tooltip top><template v-slot:activator="{ on, attrs }"><v-btn icon v-bind="attrs" v-on="on" @click="saveDocument"><img class="editor_menu" src="../static/editorMenu_icon/save.svg" alt="save"></v-btn></template><span>Save</span></v-tooltip>
      <br>

      <v-tooltip top><template v-slot:activator="{ on, attrs }"><v-btn icon v-bind="attrs" v-on="on" @click="editor.chain().focus().addColumnBefore().run()" :disabled="!editor.can().addColumnBefore()"><img class="editor_menu" src="../static/editorMenu_icon/insert-column-left.svg" alt="col insert left"></v-btn></template><span>addColLeft</span></v-tooltip>
      <v-tooltip top><template v-slot:activator="{ on, attrs }"><v-btn icon v-bind="attrs" v-on="on" @click="editor.chain().focus().addColumnAfter().run()" :disabled="!editor.can().addColumnAfter()"><img class="editor_menu" src="../static/editorMenu_icon/insert-column-right.svg" alt="col insert right"></v-btn></template><span>addColRight</span></v-tooltip>
      <v-tooltip top><template v-slot:activator="{ on, attrs }"><v-btn icon v-bind="attrs" v-on="on" @click="editor.chain().focus().deleteColumn().run()" :disabled="!editor.can().deleteColumn()"><img class="editor_menu" src="../static/editorMenu_icon/delete-column.svg" alt="delete col"></v-btn></template><span>delCol</span></v-tooltip>
      <v-tooltip top><template v-slot:activator="{ on, attrs }"><v-btn icon v-bind="attrs" v-on="on" @click="editor.chain().focus().addRowBefore().run()" :disabled="!editor.can().addRowBefore()"><img class="editor_menu" src="../static/editorMenu_icon/insert-row-top.svg" alt="row insert top"></v-btn></template><span>addRowTop</span></v-tooltip>
      <v-tooltip top><template v-slot:activator="{ on, attrs }"><v-btn icon v-bind="attrs" v-on="on" @click="editor.chain().focus().addRowAfter().run()" :disabled="!editor.can().addRowAfter()"><img class="editor_menu" src="../static/editorMenu_icon/insert-row-bottom.svg" alt="row insert bottom"></v-btn></template><span>addRowBottom</span></v-tooltip>
      <v-tooltip top><template v-slot:activator="{ on, attrs }"><v-btn icon v-bind="attrs" v-on="on" @click="editor.chain().focus().deleteRow().run()" :disabled="!editor.can().deleteRow()"><img class="editor_menu" src="../static/editorMenu_icon/delete-row.svg" alt="delete row"></v-btn></template><span>delRow</span></v-tooltip>
      <v-tooltip top><template v-slot:activator="{ on, attrs }"><v-btn icon v-bind="attrs" v-on="on" @click="editor.chain().focus().mergeOrSplit().run()" :disabled="!editor.can().mergeOrSplit()"><img class="editor_menu" src="../static/editorMenu_icon/table-merge-split.svg" alt="table merge/split"></v-btn></template><span>merge/split</span></v-tooltip>

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
        <button @click="editor.chain().focus().setImage({ float: 'none' }).run()" :class="{'is-active': editor.isActive('custom-image', {float: 'none'})}">Center</button>
        <button @click="editor.chain().focus().setImage({ float: 'right' }).run()" :class="{'is-active': editor.isActive('custom-image', {float: 'right'})}">Right</button>
      </bubble-menu>

    </div>

    <editor-content :editor="editor" class="editDoc" style="cursor: auto"/>
    <canvas id="screenshot" style="width: 100%;" hidden></canvas>
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
import BulletList from '@tiptap/extension-bullet-list'
import ListItem from '@tiptap/extension-list-item'
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
import CustomImage from '~/middleware/customImage'

import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
// load all highlight.js languages
import lowlight from 'lowlight'

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
    BubbleMenu,
  },

  data() {
    return {
      editor: null,
      dialog: false,
      inputRow: '',
      inputCol: '',
    }
  },

  created() {
    EventBus.$on('addBookmarkToDocument', item => {
      let editorHtml = this.editor.getHTML()
      const temp = `<a href="?bookmark=${item.data().title}" target="_self">${item.data().title}<a>`
      console.log(item.data().title)
      editorHtml += temp

      try {
        this.editor.commands.setContent(editorHtml)
      } catch(e){}
    })
  },

  mounted() {
    //fetchDocument 에서 불러온 데이터 content 에 설정
    this.fetchDocument();

    this.editor = new Editor({
      extensions: [
        StarterKit, Document, Paragraph, Text, Highlight, Underline, Link, CodeBlock, Image, BulletList, ListItem, Dropcursor, TextAlign, Typography, VTooltip, TableRow, TableHeader, CustomTableCell,
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
      editable: true,
      autofocus: 'end',
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
      if(!url) return;
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

    // save document in firebase storage
    saveDocument() {
      const doc = this.editor.getJSON()
      const document = JSON.stringify(doc)
      // const document = this.editor.getHTML()
      console.log(document)

      const file = this.$fire.firestore.doc(`users/${this.$fire.auth.currentUser.uid}/files/${this.$route.params.id}`)
      file.get().then( async (doc)=>{

        const title = doc.data().title;
        const fileTitle = title + '.json';
        const storageRef = this.$fire.storage.ref(`users/${this.$fire.auth.currentUser.uid}/${title}/${fileTitle}`)
        const blob = new Blob([document], {type: "application/json"})
        const uploadTask = storageRef.put(blob); // 데이터 저장

        await this.$fire.firestore.doc(`users/${this.$fire.auth.currentUser.uid}/files/${this.$route.params.id}`).update({documentSrc: uploadTask.snapshot.ref.fullPath})
      });
    },

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
        }
        catch (e){
            console.log("There is no saved document.")
          }
        })
    }
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans&family=Noto+Sans+JP&family=Noto+Sans+KR&display=swap');

.editBar{
  border-radius: 10px 10px 0 0;
}

.editDoc{
  font-family: sans-serif;
  font-weight: normal;
  text-align: justify;
  overflow-y: scroll;
  height: 30rem; //화면 크기에 따라 높이 다름.
  width: 100%;
  border: 1px solid lightslategrey;
  border-radius: 0 0 10px 10px;
}

.editor_menu{
  width: 70%;
}

:disabled{
  visibility: hidden;
  background-color: #aaaaaa;
}

.ProseMirror{
  > * + * {
    margin-top: 0.75em;
  }

  min-height: 30rem; // 화면 크기에 따라 높이 다름.
  padding: 1em;
  outline: none;

  ul,
  ol {
    padding: 0 1rem;
  }

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
  height: auto;
  display: block;
  margin-left: auto;
  margin-right: auto;

  &.ProseMirror-selectednode {
    outline: 2px solid #35495e;
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
.bubble-menu {
  display: flex;
  background-color: #35495e;
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
}


</style>
