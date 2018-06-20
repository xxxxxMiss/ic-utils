import { isPureObj, isFn } from 'ic-utils'

export default function install (Vue) {
  Vue.directive('focus', {
    inserted (el, { value, modifiers }) {
      const DEFAULTS = {
        behavior: 'auto',
        block: 'start',
        inline: 'nearest'
      }
      let target = el

      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.focus()
      } else {
        target = el.querySelector('input') || el.querySelector('textarea')
        target && target.focus()
      }

      if (isPureObj(value) && value.block) {
        DEFAULTS.block = value.block
        target.scrollIntoView(DEFAULTS)
      } else if (modifiers['into-view']) {
        target.scrollIntoView(DEFAULTS)
      }

      if (isFn(value)) {
        value(el)
      }
      if (isPureObj(value) && isFn(value.handler)) {
        value.handler(el)
      }
    }
  })
}
