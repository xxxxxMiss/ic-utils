/**
 *  created at 2018/06/20 13:51 by xxxxxMiss
 */

import { isPureObj } from 'ic-utils'

export function install (Vue, options = {}) {
  const DEFAULTS = {
    behavior: 'auto',
    block: 'start',
    inline: 'nearest'
  }

  let opt = Object.assing({}, DEFAULTS, options)

  Vue.directive('into-view', {
    bind (el, { value }) {
      if (isPureObj(value)) {
        opt = Object.assing(opt, value)
      }
      el.scrollIntoView(opt)
    }
  })
}