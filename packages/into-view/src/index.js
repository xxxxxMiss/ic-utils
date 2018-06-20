/**
 *  created at 2018/06/20 13:51 by xxxxxMiss
 */

import { isPureObj } from 'ic-utils'

export default function install (Vue, options = {}) {
  const DEFAULTS = {
    behavior: 'auto',
    block: 'start',
    inline: 'nearest'
  }

  let opt = Object.assign({}, DEFAULTS, options)

  Vue.directive('into-view', {
    bind (el, { value }) {
      if (isPureObj(value)) {
        opt = Object.assign(opt, value)
      }

      const handler = () => el.scrollIntoView(opt)
      el.__handler = handler

      const formEl = el.querySelectorAll('input') || el.querySelectorAll('textarea')
      if (formEl.length) {
        // proxy event
        el.addEventListener('focusin', handler)
      } else {
        el.scrollIntoView(opt)
      }
    },
    unbind (el) {
      const handler = el.__handler
      if (handler) {
        el.removeEventListener('focusin', handler)
        delete el.__handler
      }
    }
  })
}