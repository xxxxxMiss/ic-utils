## Introduction
> It is an encapsulation of [clipboard](https://github.com/zenorocha/clipboard.js) for convenience to use it in Vue.

## Install
```
$ npm i ic-vue-clipboard || yarn add ic-vue-clipboard
```

## Usage
```
import Vue from 'vue'
import IcClipboard from 'ic-vue-clipboard'

Vue.use(IcClipboard)
```

Than, you can use it in component as below:
`<button v-copy>copied</button>`

`v-copy` directive supports `arg`, `modifiers` and `value`.
If you are not familiar with these concepts, [click here](https://cn.vuejs.org/v2/guide/custom-directive.html)

## Advanced usage
> In clipboardjs, if you want to dynamically set a `target`, you can do it like this:

```
new ClipboardJS('.btn', {
    target: function(trigger) {
        return trigger.nextElementSibling;
    }
})
```

In Vue, do the same stuff with an arg.

### arg
> Will copy text from it.
> It should be an similar css selector.
> Note: you should exclude the prefix of an css selector. For example:
> an class selector `.class-name`, than the arg is `class-name`;
> an id selector `#id`, than the arg is `id`.

```
<div v-copy:foo>
    
</div>
```

> In clipboardjs, if you want to dynamically set a `text`, you can do it like this:

```
new ClipboardJS('.btn', {
    text: function(trigger) {
        return trigger.getAttribute('aria-label');
    }
})
```

In Vue, do the same stuff with a string value

```
<div v-copy="'some texts'">
    
</div>
```

> When you want to get more controls with copy, you can pass an object with options. eg: Using the directive in a component and the clicked element is a child of this component, you can pass a `trigger` option etc. A example as below:

```
// template
// trigger is a css select: #id, .class-name...
<div v-copy="{ trigger: '#id', enable, success, error }">
    
</div>

import { isWechat } from 'ic-utils'

<script>
    data () {
        return {
            enable: !isWechat,
        }
    },
    methods: {
        success () {
            // your logic code is here when copied
        },
        error () {
            // your handler when occured error
        }
    }
</script>
```


> If you want to cut texts in form elements as `input` `textarea`, you can use modifier `cut`.

```
<div v-copy.cut="{}">
    
</div>
```

> By defaults, the texts of clipboard was selected, if you want to reject it, use a `clear` modifier:

```
<div v-copy.clear>
    
</div>
```
