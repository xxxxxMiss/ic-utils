/**
 *  created at 2018/06/23 10:55 by xxxxxMiss
 */
import { isPureObj, isArray, isFn } from '../../util/src/index'

// in for: __data = { [key]: value }
// not in for: __data = value

// in for: __handlers = { [key]: [fn] }
// not in for: __handlers = [fn]
let __data = {}
let __handlers = {}
let __targets = []

const isInIteration = vnode => !!vnode.key || vnode.key === 0

const handleData = (vnode, value) => {
  if (isInIteration(vnode)) {
    __data[vnode.key] = value
  } else {
    __data = value
  }
}

const handleEvent = (vnode, handler) => {
  if (isInIteration(vnode)) {
    ;(__handlers[vnode.key] || (__handlers[vnode.key] = [])).push(handler)
  } else {
    if (isArray(__handlers)) {
      __handlers.push(handler)
    } else {
      ;(__handlers = []).push(handler)
    }
  }
}

export default function install (Vue, options) {
  Vue.directive('track', {
    bind (el, { value, arg }, vnode) {
      const handlerKeys = arg.split('|')
      
      value && handleData(vnode, value)

      if (isPureObj(value) && value.trigger) {
        if (isArray(value.trigger)) {
          // v-track:arg1|arg2="{
          //  trigger: ['.selector1', '.selector2'],
          //  params: [[p1], [p2, p3]]
          // }"
          value.trigger.forEach((selector, index) => {
            const target = el.querySelector(selector)
            const handler = () => options[handlerKeys[index]].apply(
              this,
              ((__data[vnode.key] || __data).params || {})[index]
            )
            if (target) {
              __targets.push(target)
              handleEvent(vnode, handler)
              target.addEventListener('click', handler)
            }
          })
        } else {
          // v-track:arg="{
          //  trigger: '.selector',
          //  params: p1 || [p1, p2]
          // }"
          const target = el.querySelector(value.trigger)
          const handler = () => {
            const data = __data[vnode.key] || __data
            const ps = isArray(data.params)
              ? data.params
              : [data.params]
            options[handlerKeys[0]].apply(this, ps)
          }
          if (target) {
            __targets.push(target)
            handleEvent(vnode, handler)
            target.addEventListener('click', handler)
          }
        }
      } else {
        // v-track:arg="[p1, p2]"
        // v-track:arg
        const handler = () => {
          let data = __data[vnode.key] || __data
          data = isArray(data) ? data : [data]
          options[handlerKeys[0]].apply(this, data)
        }
        handleEvent(vnode, handler)
        el.addEventListener('click', handler)
      }
    },

    update (el, { value }, vnode) {
      value && handleData(vnode, value)
    },

    unbind (el, binding, vnode) {
      const handlers = __handlers[vnode.key] || __handlers
      if (__targets.length > 0 && handlers.length > 0) {
        __targets.forEach((t, i) => t.removeEventListener('click', handlers[i]))
      } else {
        el.removeEventListener('click', handlers[0])
      }
      __targets = []
      __handlers = {}
      __data = {}
    }
  })

  if (options.router && isFn(options.router.afterEach) && isFn(options.afterEach)) {
    options.router.afterEach(options.afterEach)
  }
}
