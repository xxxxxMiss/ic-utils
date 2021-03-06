# v-qrcode
> It is an encapsulation of [qrcodejs2](https://www.npmjs.com/package/qrcodejs2) for you using it by directive in Vue.

### Install
```
$ npm i ic-vue-qrcode || yarn add ic-vue-qrcode
```

### Usage
> There are two ways you can use it:

### As a global plugin

``` js
import Vue from 'vue'
import IcQRCode from 'ic-vue-qrcode'

Vue.use(IcQRCode)
```

### As a scoped directive

``` js
import { qrcodeDirective } from 'ic-vue-qrcode'

{
    directives: {
        'qrcode': qrcodeDirective,
        // ... other directives
    }
}
```

in template:

```
<template>
    <div v-qrcode="value">
        
    </div>
</template>

<script>
  export default {
    data () {
        return {
            value: '',
            // value: { text: '', width: '', ... }
        }
    },
    methods: {
        value () {
            // your logic code
            // return 'http://www.baidu.com'
            return {
                text: 'http://www.baidu.com',
                width: '',
                height: ''
                // some other options passed to qrcodejs2 lib
            }
        }
    }
  }
</script>
```

> The `value` can be a string, an object and a function returned a string or an object.

**NOTE**
> When you want to show qrcode in specified conditions, for examples: in `wechat` platform don't show it and showing in common browsers, you can pass an `enable` in value.

``` js
{
    text: '',
    // ...,
    enable: !isWechat
}
```
