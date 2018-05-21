import { isString, isPureObj, isFn } from 'ic-utils'

const handler = (el, value) => {
  return import('qrcodejs2').then(m => {
    const QRCode = m.default || m
    let DEFAULTS = {
      width: 210,
      height: 210,
      colorDark: '#000000',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.H
    }

    if (isString(value)) {
      DEFAULTS.text = value
    }

    if (isPureObj(value)) {
      DEFAULTS = Object.assign(DEFAULTS, value)
    }

    if (isFn(value)) {
      const ret = value()
      if (isString(ret)) {
        DEFAULTS.text = ret
      }
      if (isPureObj(ret)) {
        DEFAULTS = Object.assign(DEFAULTS, ret)
      }
    }

    return new QRCode(el, DEFAULTS)
  })
}

export const qrcodeDirective = {
  bind (el, { value }) {
    handler(el, value)
  },
  update (el, { value }) {
    handler(el, value)
  }
}

export default (Vue) => {
  Vue.directive('qrcode', (el, { value }) => {
    handler(el, value)
  })
}
