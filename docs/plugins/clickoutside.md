# v-clickoutside
> A directive for clicking a outside area of a target and trigger a callback.

### Install
>$ npm i ic-clickoutside || yarn add ic-clickoutside

### Usage
> It is dead simple, a `handler` triggered by clicking clickoutside or do nothing if not specify a `handler`.

``` html
<div v-clickoutside="handler">
    
</div>
```
The `handler` receive one argument: clicked element.