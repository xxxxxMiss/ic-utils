# v-fullscreen
> A Vue directive for browser into fullscreen mode.

### Install
>$ npm i ic-vue-fullscreen || yarn add ic-vue-fullscreen


### Usage

``` js
import Vue from 'vue'
import IcVueFullscreen from 'ic-vue-fullscreen'

Vue.use(IcVueFullscreen, options) // options is an optional object
```

``` html
<div v-fullscreen>
    
</div>
```

If you want to do some stuff when browser into fullscreen mode or exiting fullscreen mode, you can use it with a handler:

``` html
<component v-fullscreen="handler"></component>
```

``` js
{
    methods: {
        handler (fullscreenElement) {
            // fullscreenElement is exists when browser into fullscreen
            // or is null when browser exited fullscreen
        }
    }
}
```


#### options.events
> Currently, `options` only supports a `events` prop.
> It's an array of events, defaults to ['click'].

More informations about `Fullscreen API`, see [here](https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API)
