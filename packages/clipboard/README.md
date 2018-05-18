## Introduction
> It is an encapsulation of [clipboard](https://github.com/zenorocha/clipboard.js) for convenience to use it in Vue.

## Install
```
$ npm i ic-clipboard || yarn add ic-clipboard
```

## Usage
```
import Vue from 'vue'
import IcClipboard from 'ic-clipboard'

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
> It should be an css selector.
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

> There are cases where you'd like to show feedback or capture what has been selected after a copy/cut operation. Do it like this:

```
// template
<div v-copy="clipboardFeedback">
    
</div>

// script
{   
    methods: {
        clipboardFeedback () {
            return {
                success: () => { // ... },
                error: () => { // ... }
            }
        }
    }
}
```

Note: If the `clipboardFeedback` don't return an object but an function than we regard it as a success callback.

> If you want to cut texts in form elements as `input` `textarea`, you can use modifier `cut`.

```
<div v-copy.cut="clipboardFeedback">
    
</div>
```

> By defaults, the texts of clipboard was selected, if you want to reject it, use a `clear` modifier:

```
<div v-copy.clear>
    
</div>
```
