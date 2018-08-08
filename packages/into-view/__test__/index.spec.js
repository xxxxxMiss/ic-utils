import { createLocalVue, shallowMount } from '@vue/test-utils'
import sinon from 'sinon'
import IcIntoView from '@/into-view'
import TestComponent from './components/events.vue'

const Vue = createLocalVue()
Vue.use(IcIntoView)

describe('Directive v-into-view', () => {
  it('with no expression', () => {
    shallowMount(TestComponent, { localVue: Vue, attachToDocument: true })
  })
})
