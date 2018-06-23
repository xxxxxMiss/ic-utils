# v-track
> Aim of this plugin: in some scenarios, we want to track user's action with the third statistics code, these codes polluted our business code. If we placed these code in a individual place that is pretty good, so this plugin is borned.

### Install
>$ npm i ic-vue-track || yarn add ic-vue-track

### Usage
> Assuming you are using [cnzz](https://web.umeng.com/main.php?spm=a211g2.181323.0.0.3cb23604oKO0t2&c=user&a=index) then you can use it as below:

``` js
import Vue from 'vue'
import IcVueTrack from 'ic-vue-track'

Vue.use(IcVueTrack, options)
```
The `options` is an object with your statistics code:

``` js
export default {
    shareButton () {
        _czc.push([
          '_trackEvent',
          '用户在该页面分享的意愿',
          `职位首页_点击分享图标_按钮点击`,
          '用户在该页面分享的意愿'
        ])
    },
    'search-button' () {
        _czc.push([
          '_trackEvent',
          '搜索功能使用的频次',
          `职位首页_点击搜索图标_按钮点击`,
          '搜索功能使用的频次'
        ])
    },
    'filter' (headerTitle, name) {
        _czc.push([
          '_trackEvent',
          '用户对不同筛选项的使用频次',
          `职位首页_职位列表页筛选项_${headerTitle}_${name}_按钮点击`,
          '用户对不同筛选项的使用频次'
        ])
    }
}
```
The example above, the `key` of `options` is a indentifier for directive's arg, so the directive in template like this:

``` html
<div v-track:search-button>
    
</div>
```

If the statistics code receive some params, you can pass an **array** to it:
``` html
<div v-track:filter="[headerTitle, name]">
    
</div>
```

If you use it on a component and triggered element is not the `el` of this directive but it's children, thats you can pass an object to this directive with `triggers` and `params` props and the `arg` is a string separate by pipes('|'):

``` html
<component
    v-track:search-button|filter="{
        triggers: ['.class-name', '#id'],
        params: [[], [headerTitle, name]]
    }">
</component>
```

::: warning
In this case, the order of arg、triggers and params must be one-to-one matched.
Internally, we find target node by a selector `.class-name` in triggers and execute `search-button` statistics code and passed `[]` to it in a handler. The order of rest is similar.
:::

Also, you can pass a `router` instance and a global guard to `options` to track action of page-level:

main.js

``` js
import Vue from 'vue'
import IcVueTrack from 'ic-vue-track'
import router from '/some/path/router'
import trackConfig from '/some/path/track'

Vue.use(IcVueTrack, { router, ...trackConfig })
```

``` js
export default {
    afterEach (to, from) {
        _czc.push(['_trackPageview', to.fullPath, from.fullPath])
    },
    shareButton () {
        _czc.push([
          '_trackEvent',
          '用户在该页面分享的意愿',
          `职位首页_点击分享图标_按钮点击`,
          '用户在该页面分享的意愿'
        ])
    },
    // ...
}
```
