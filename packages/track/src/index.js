/**
 *  created at 2018/06/23 10:55 by xxxxxMiss
 */
import { isPureObj, isArray, isFn } from 'ic-utils'

export default function install (Vue, options) {
  Vue.directive('track', {
    bind (el, { value, arg }) {
      el.dataset.targets = []
      el.dataset.handlers = []

      const handlerKeys = arg.split('|')

      if (isPureObj(value) && value.trigger) {
        if (isArray(trigger)) {
          trigger.forEach((selector, index) => {
            const target = el.querySelector(selector)
            const handler = () => options[handlerKeys[index]](...(value.params || [])[index])
            if (target) {
              target.addEventListener('click', handler)
              el.dataset.targets.push(target)
              el.dataset.handlers.push(handler)
            }
          })
        } else {
          const target = el.querySelector(trigger)
          const handler = () => options[handlerKeys[0]](...value.params)
          if (target) {
            target.addEventListener('click', handler)
            el.dataset.targets.push(target)
            el.dataset.handlers.push(handler)
          }
        }
      } else {
        const handler = () => options[handlerKeys[0]](isArray(value) ? ...value : null)
        el.addEventListener('click', handler)
        el.dataset.handlers.push(handler)
      }
    },

    unbind (el) {
      const targets = el.dataset.targets
      const handlers = el.dataset.handlers
      if (targets.length > 0 && handlers.length > 0) {
        targets.forEach((t, i) => t.removeEventListener('click', handlers[i]))
      } else {
        el.removeEventListener('click', handlers[0])
      }
      delete el.dataset.targets
      delete el.dataset.handlers
    }
  })

  if (options.router && isFn(router.afterEach) && isFn(options.afterEach)) {
    router.afterEach(afterEach)
  }
}
