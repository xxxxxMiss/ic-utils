/**
 *  created at 2018/06/20 14:01 by xxxxxMiss
 */

export default function install (Vue) {
  Vue.directive('clickoutside', {
    bind (el, binding) {
      function handleEvent (e) {
        if (el.contains(e.target)) {
          return false
        }

        if (binding.value) {
          binding.value(e)
        }
      }

      el.__handler__ = handleEvent
      document.addEventListener('click', handleEvent)
    },
    unbind (el) {
      document.removeEventListener('click', el.__handler__)
      delete el.__handler__
    }
  })
}
