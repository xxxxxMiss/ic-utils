import { isPureObj, isString, isBool } from 'ic-utils'

const handler = (el, { value, modifiers, arg }) => {
  return import('clipboard').then(m => {
    const options = {}
    let trigger = el
    let enable = true
    let success = () => {}
    let error = () => {}

    if (isPureObj(value)) {
      trigger = document.querySelector(value.trigger) || trigger
      success = value.success || success
      error = value.error || error
      if (isBool(value.enable)) {
        enable = value.enable
      }
    }

    if (!enable) return
    
    // TODO: add `target` option
    options.text = trigger => {
      if (isString(value)) return value

      if (arg) {
        const t = document.querySelector(`#${arg}`) ||
          document.querySelector(`.${arg}`) ||
          document.querySelector(arg)
        return t && t.textContent
      }

      return ''
    }

    if (modifiers.cut) {
      options.action = trigger => 'cut'
    }
    
    const ClipboardJS = m.default || m
    const clipboard = new ClipboardJS(trigger, options)

    clipboard.on('success', e => {
      // only effective with `target` option
      // modifiers.clear && e.clearSelection()
      success()
    })

    clipboard.on('error', e => {
      error()
    })

    el.__target = clipboard
  })
}

export default Vue => {
  Vue.directive('copy', {
    bind (el, binding) {
      handler(el, binding)
    },
    // update (el, binding) {
    //   handler(el, binding)
    // },
    unbind (el, binding) {
      const clipboard = el.__target
      if (clipboard) {
        clipboard.destroy()
        delete clipboard.__target
      }
    }
  })
}
