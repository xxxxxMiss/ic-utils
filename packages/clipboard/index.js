import { isPureObj, isFn, isString } from 'ic-utils'

const handler = (el, { value, modifiers, arg }) => {
  return import('clipboard').then(m => {
    const ClipboardJS = m.default || m
    const options = {}

    if (isString(value)) {
      options.text = trigger => value
    }

    if (arg) {
      options.target = trigger => {
        return document.querySelector(`#${arg}`) ||
          document.querySelector(`.${arg}`) ||
          document.querySelector(arg)
      }
    }

    if (modifiers.cut) {
      options.action = 'cut'
    }

    const clipboard = new ClipboardJS(el, options)

    if (isFn(value)) {
      const ret = value()
      if (isPureObj(ret)) {

        if (isFn(ret.success)) {
          clipboard.on('success', e => {
            success(e)
            modifiers.clear && e.clearSelection()
          })
        }

        if (isFn(ret.error)) {
          clipboard.on('error', e => {
            ret.error(e)
          })
        }
      } else {
        clipboard.on('success', e => {
          ret(e)
          modifiers.clear && e.clearSelection()
        })
      }
    }

    el.__target = clipboard
  })
}

export default Vue => {
  Vue.directive('copy', {
    bind (el, binding) {
      handler(el, binding)
    },
    update (el, binding) {
      handler(el, binding)
    },
    unbind (el, binding) {
      const clipboard = el.__target
      clipboard.destroy()
      delete clipboard.__target
    }
  })
}