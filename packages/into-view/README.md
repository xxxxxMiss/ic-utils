## v-into-view
> Use this directive to scroll any an element into view.

## Install
>$ npm i ic-into-view || yarn add ic-into-view

## Usage

with no expression:
``` html
<div v-into-view>
    
</div>
```

with a expression:
``` html
<div v-into-view="{ block: 'center' }">
    
</div>
```
use it on form element or a component contains form-elements in it:
```html
<input type="text" v-into-view>
```
> Internally, we use native api `scrollIntoView`, so the expression can be an object with [these props](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView). The defaults is `{behavior: 'auto', block: 'start', inline: 'nearest'}`.