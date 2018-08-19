import Cookie from '../src/cookie'
import { parseCookie } from '../src/helpers'

let inst = null

beforeAll(() => {
  inst = new Cookie()
})

describe('call setItem method', () => {
  test('base64 encoding automatically', () => {
    inst.setItem('name', 'test')
    expect(document.cookie).toBe(window.btoa('name') + '=' + window.btoa('test'))
  })

  test('with a config object as the third param', () => {
    inst.setItem('age', '30', { path: '/path/age' })
  })
})

describe('call getItem method', () => {
  test('with the same config as setItem method', () => {
    expect(inst.getItem('name')).toBe('test')

    expect(inst.getItem('age')).toBeNull()
    expect(inst.getItem('age')).toBe('30')
  })
})

test('call length method to get cookie sizes', () => {
  expect(inst.length()).toBe(2)
})
