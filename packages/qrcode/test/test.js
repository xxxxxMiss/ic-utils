import test from 'ava'
import Vue from 'vue'
import IcQRCode from '../src/index'

Vue.use(IcQRCode)

test('Directive v-qrcode', t => {
  const vm = new Vue({
    template: `
      <div v-qrcode="'test'"></div>
    `
  }).$mount()
  const tree = {
    $el: vm.$el.outerHTML
  }
  t.snapshot(tree)
})

