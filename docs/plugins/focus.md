# v-focus
> Use this directive on a form element or a component contains form-elements to let the form-elements focus.

### Install
>$ npm i ic-vue-focus || yarn add ic-vue-focus

### Usage

base:
``` html
<input type="text" v-focus>
```

If you want the element scroll into view when focused, you can specify an `modifier` like this:

``` html
<input type="text" v-focus.into-view>
```

You can use this directive with an option:
``` html
<input type="tel" v-focus="{ block: 'end' }">
```

The option with a `handler` prop when you want to do some stuff when the element focused:
``` html
<input type="text" v-focus="{ block: 'center', handler: handleFocus }">
```

``` js
{
    method: { handleFocus () {} }
}
```

Also, the option can be a function directly:

``` html
<input type="text" v-focus="handler">
```

More informations about the `option`, you can see [here](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView).