# ic-vue-share
> An module about wechat-share for rapid development.

### Install
You can get it from npm.

``` sh
$ npm i ic-vue-share || yarn add ic-vue-share
```

### Usage

```
import Vue from 'vue'
import IcShare from 'ic-vue-share'

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

debug
> The option is convenient for developing. A boolean which to set by `process.env.NODE_ENV`. Thats to say, it is `false` when `process.env.NODE_ENV === 'production'`. Of course, you can explicitly passed a boolean value to it.

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

### `$enableWechatShare(shareDataConfig, jsApiList)`
> In internal, we mounted a method `$enableWechatShare` to `Vue.prototype`, so you can use `this.$enableWechatShare` in pages will be shared.

### `$setWechatShareUrl`
> This api for compatibility with ios platform in some special scenarios. We can only use the url of the first opening a page to auth wechat-jsApi once, if you have redirection scenario, you may use the api to set the first url.

For example: Assuming we have three pages, `list`, `home`, `login`. If you have logined and scan a qrcode of login page than redirect to home page, but your shared page is list page. In this case , you should call `$setWechatShareUrl` in home page as below:

home.vue
```
{
    mounted: {
        this.$setWechatShareUrl(window.location.href)
    }
}
```

If redirecting to page will be shared directly, you need call `$enableWechatShare` in that page only.