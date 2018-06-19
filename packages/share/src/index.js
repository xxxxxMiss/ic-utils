import { isIOS, isFn } from 'ic-utils'

function configAuthQuery () {
  const url = isIOS
    ? window.iosFirstUrl
    : window.location.href.split('#')[0]
  return {
    param: '_callback',
    prefix: `&url=${encodeURIComponent(url)}`,
    name: '_callback'
  }
}

/**
 * [callJsApi description]
 * @param  {[type]} config
 * {
 *   onMenuShareTimeline: {title: '', link: '', imgUrl: '', success: () => {}}
 * }
 * @param  {[type]} jsApiList ['onMenuShareTimeline', 'onMenuShareAppMessage']
 * @return {[type]}           [description]
 */
function callJsApi (wx, config, jsApiList) {
  jsApiList = jsApiList || Object.keys(config)
  jsApiList.forEach(apiKey => {
    wx[apiKey](config[apiKey])
  })
}

function configAuth (wx, authParams, shareDataConfig, jsApiList, debug) {
  // jsApiList is changed by wechat after auth
  // so split the referance here
  const jsApiListStr = JSON.stringify(jsApiList)

  wx.config(Object.assign({}, authParams, {
    jsApiList: JSON.parse(jsApiListStr),
    debug
  }))
  wx.ready(() => {
    callJsApi(wx, shareDataConfig, JSON.parse(jsApiListStr))
  })
  wx.error(res => {
    console.error(res)
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
  jsApiList = jsApiList || options.jsApiList || Object.keys(config)

  const authFn = isFn(options.authFn) && options.authFn

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
    callJsApi(wx, config, jsApiList)
  }
}

export default {
  install (Vue, options) {
    // in IOS platform, we can only use the entry url
    window.iosFirstUrl = window.location.href.split('#')[0]

    if (options.debug == null) {
      options.debug = process.env.NODE_ENV != 'production'
    }

    Vue.prototype.$enableWechatShare = (shareDataConfig, jsApiList) => {
      import('weixin-js-sdk').then(m => {
        const wx = m.default || m
        enableWechatShare(wx, options, shareDataConfig, jsApiList)
      })
    }
    
    // if you have redirection scenario, you should call this api to set window.iosFirstUrl
    Vue.prototype.$setWechatShareUrl = url => window.iosFirstUrl = url.split('#')[0]
  }
}
