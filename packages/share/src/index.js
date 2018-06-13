import { isIOS } from 'ic-utils'

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
function jsApiConfig (wx, config, jsApiList) {
  jsApiList.forEach(apiKey => {
    wx[apiKey](config[apiKey])
  })
}

function configAuth (wx, authParams, shareDataConfig, jsApiList, debug) {
  wx.config(Object.assign({}, authParams, { jsApiList, debug }))

  // jsApiList is changed by wechat after auth
  // so split the referance here
  const jsApiListStr = JSON.stringify(jsApiList)

  wx.ready(() => {
    jsApiConfig(wx, shareDataConfig, JSON.parse(jsApiListStr))
  })
  wx.error(res => {
    console.log(res)
  })
}

function myAuth (wx, options, shareDataConfig, jsApiList) {
  // even through this function is not called
  // code static scan has know it, you must install it manually
  return import('ic-jsonp').then(m => {
    const jsonp = m.default || m
    jsonp(options.url, configAuthQuery(), (err, data) => {
      if (err) {
        throw new Error(err.message)
      }

      const { appId, timestamp, nonceStr, signature } = data.results

      configAuth(wx, {
        appId,
        timestamp,
        nonceStr,
        signature
      }, shareDataConfig, jsApiList, options.debug)
    })
  })
}

function enableWechatShare (wx, options, config, jsApiList) {
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
        configAuth(wx, params, config, jsApiList, options.debug)
      })
    } else {
      myAuth(wx, options, config, jsApiList)
    }
  } else if (isIOS && window.hasAuth) {
    jsApiConfig(wx, config, jsApiList)
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
      import('weixin-js-sdk').then(m => {
        const wx = m.default || m
        wx.showAllNonBaseMenuItem()
        enableWechatShare(wx, options, shareDataConfig, jsApiList)
      })
    }

    // Vue.mixin({
    //   // env maybe ssr, use it only client-side
    //   beforeMount () {
    //     if (options.hideAllMenus) {
    //       import('weixin-js-sdk').then(m => {
    //         const wx = m.default || m
    //         wx.hideAllNonBaseMenuItem()
    //       })
    //     }
    //   }
    // })
  }
}
