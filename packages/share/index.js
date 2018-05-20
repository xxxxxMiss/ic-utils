import jsonp from 'jsonp'
import wx from 'weixin-js-sdk'

import { isIOS } from '../util'

function configAuthQuery () {
  const url = window.location.href.split('#')[0]
  return {
    param: '_callback',
    prefix: `&url=${encodeURIComponent(url)}`,
    name: '_callback'
  }
}

/**
 * [jsApiConfig description]
 * @param  {[type]} config
 * {
 *   onMenuShareTimeline: {title: '', link: '', imgUrl: '', success: () => {}}
 * }
 * @param  {[type]} jsApiList ['onMenuShareTimeline', 'onMenuShareAppMessage']
 * @return {[type]}           [description]
 */
function jsApiConfig (config, jsApiList) {
  jsApiList.forEach(apiKey => {
    wx[apiKey](config[apiKey])
  })
}

function configAuth (authParams, shareDataConfig, jsApiList, debug) {
  wx.config({
    ...authParams,
    jsApiList,
    debug
  })
  wx.ready(() => {
    jsApiConfig(shareDataConfig, jsApiList)
  })
  wx.error(res => {
    console.log(res)
  })
}

function myAuth (options, shareDataConfig, jsApiList) {
  jsonp(options.url, configAuthQuery(), (err, data) => {
    if (err) {
      throw new Error(err.message)
    }

    const { appId, timestamp, nonceStr, signature } = data.results

    configAuth({
      appId,
      timestamp,
      nonceStr,
      signature
    }, shareDataConfig, jsApiList, options.debug)
  })
}

function enableWechatShare (options, config, jsApiList) {
  if (Array.isArray(config)) {
    [config, jsApiList] = [jsApiList, config]
  }

  jsApiList = jsApiList || options.jsApiList || Object.keys(config)

  const authFn = typeof options.authFn === 'function' && options.authFn

  if (isIOS && !window.hasAuth || !isIOS) {
    window.hasAuth = true
    if (authFn) {
      const pr = authFn()
      if (typeof pr.then != 'function') {
        throw new Error('authFn must be return a promise')
      }
      pr.then(params => {
        configAuth(params, config, jsApiList, options.debug)
      })
    } else {
      myAuth(options, config, jsApiList)
    }
  } else if (isIOS && window.hasAuth) {
    jsApiConfig(config, jsApiList)
  }
}


export default {
  install (Vue, options) {
    if (options.hideAllMenus == null) {
      options.hideAllMenus = true
    }

    if (options.debug == null) {
      options.debug = process.env.NODE_ENV != 'production'
    }

    Vue.prototype.$enableWechatShare = (shareDataConfig, jsApiList) => {
      wx.showAllNonBaseMenuItem()
      enableWechatShare(options, shareDataConfig, jsApiList)
    }

    Vue.mixin({
      // env maybe ssr, use it only client-side
      beforeMount () {
        if (options.hideAllMenus) {
          wx.hideAllNonBaseMenuItem()
        }
      }
    })
  }
}
