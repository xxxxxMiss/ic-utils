## Install
You can get it from npm.
``` sh
$ npm i ic-share || yarn add ic-share
```

## Usage

```
import Vue from 'vue'
import IcShare from 'ic-share'

Vue.use(IcShare, options)
```


### Optional param `options`
> You can passed an optional object as the second param, you can define some useful properties in the options as below:

url
> A string value for getting auth from wechat for using jsApi.
> Required. Throw an error both `authFn` and `url` are null.

authFn
> Internal, we use a jsonp function to get authentication from the specified url above. You can customize yourself's logic for authentication from server by the `authFn` function. The function must be return a promise or async function with auth-data from server. We dont supports callback form...

jsApiList
> An array of interfaces needed to be auth. More informations is [here](https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421141115).

hideAllMenus
> A boolean which defaults to `true`.
> Because in an application only some pages need to be shared not all pages. In our scene, use share functionality both `position-list` and `position-detail`. share functionality enabled in one page, it enabled automatically.

debug
> The option is convenient for developing. A boolean which to set by `process.env.NODE_ENV`. Thats to say, it is `false` when `process.env.NODE_ENV === 'production'`. Of course, you can explicitly passed a boolean value to it.

## `$enableWechatShare(shareDataConfig, jsApiList)`
> In internal, we mounted only one method `$enableWechatShare` to `Vue.prototype`, so you can use `this.$enableWechatShare` in all components.

### shareDataConfig
> Required. An object config jsApiList data.

```
    {
        data () {
            return {
                shareDataConfig: {
                    onMenuShareTimeline: {
                        title: '',
                        desc: '',
                        link: '',
                        // ...
                    },
                    onMenuShareQQ: {
                        title: '',
                        desc: '',
                        imgUrl: '',
                        // ...
                    }
                }
            }
        }
    }
```

### jsApiList
> An string array of auth-interfaces. It is optional, once you config jsApi data like above, if you omited it, we get it with `Object.keys(shareDataConfig)`.
> Actually, we get it from these places:

```
jsApiList = jsApiList || options.jsApiList || Object.keys(shareDataConfig)
```

So a detail example as below:

```
Vue.use(IcShare, {
    // if you specify authFn, than url is optional
    url: '//path/a/b',
    // optional
    jsApi: ['onMenuShareQQ', ...],
    // optional
    debug: '',
    // optional
    authFn: async () => {
        // http send and get data from server
        const authData = await ajax('....')
        return authData
    },
    // optional
    hideAllMenus: ''
})
```

In a component:

```
method: {
    share () {
        this.$enableWechatShare(this.shareDataConfig)
    }
}
```