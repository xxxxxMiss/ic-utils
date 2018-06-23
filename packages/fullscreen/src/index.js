/**
 *  created at 2018/06/22 20:35 by xxxxxMiss
 */

import { isFn } from 'ic-utils'

const CHANGE_EVENT = ['fullscreenchange', 'webkitfullscreenchange']

const fullscreenEl = () => document.webkitFullscreenElement || document.fullscreenElement

const extFullscreen = () => (document.webkitExitFullscreen || document.exitFullscreen).bind(document)

const rstFullscreen = el => (el.webkitRequestFullscreen || el.requestFullsreen).bind(el)

const bindEvent = (el, events, handler, off = false) => {
  events.forEach(event => {
    if (off) {
      el.removeEventListener(event, handler)
    } else {
      el.addEventListener(event, handler)
    }
  })
}

export default function install (Vue, options = {}) {
  options = Object.assign({}, {
    events: ['click']
  }, options)

  Vue.directive('fullsreen', {
    bind (el, { value }) {
      const handler = e => {
        if (fullscreenEl()) {
          extFullscreen()
        } else {
          rstFullscreen()
        }
      }
      bindEvent(el, options.events, handler)
      el.__handler = handler

      if (isFn(value)) {
        const changeHandler = () => value(fullscreenEl())
        // fullscreenchange triggered only on document
        bindEvent(document, CHANGE_EVENT, changeHandler)
        el.__changeHandler = changeHandler
      }
    },

    unbind (el, { value }) {
      bindEvent(el, options.events, el.__handler, true)
      delete el.__handler
      if (isFn(value)) {
        bindEvent(document, CHANGE_EVENT, el.__changeHandler, true)
        delete el.__changeHandler
      }
    }
  })
}