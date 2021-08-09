import Image from '@tiptap/extension-image'
import { mergeAttributes } from '@tiptap/core'

export default Image.extend({
  name: 'custom-image',

  addAttributes() {
    return {
      ...Image.config.addAttributes(),
      size: {
        default: 'large',
        rendered: true  //-> HTML 태그를 렌더링할 때 속성으로 추가할지 결정
      },
      float: {
        default: 'Center',
        rendered: true
      }

    }
  },

  addCommands() {
    return {
      setImage: (options) => ({ tr, commands }) => {
        if(tr.selection?.node?.type?.name === 'custom-image') {
          return commands.updateAttributes('custom-image', options)
        }
        else {
          return commands.insertContent({
            type: this.name,
            attrs: options
          })
        }
      },
    }
  },

  renderHTML({ node, HTMLAttributes }) {

    HTMLAttributes.class = ' custom-image-' + node.attrs.size
    HTMLAttributes.class += ' custom-image-float-' + node.attrs.float

    return [
      'img',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)
    ]
  }
})
