# v-validate
> A validation library for Vue.js. You can validate native inputs as well as custome Vue components.

### Install
>$ npm i ic-vue-validator || yarn add ic-vue-validator

## Validation Rules

- required
- min
- minVale
- max
- maxValue
- length
- regex
- email
- after
- before
- between

``` js
{
    rules: {
        email: 'email'
        phone: 'required|length:11',
        // => { key: 'phone': rules: [{ rule: 'required', params: [] }, { rule: 'length', parmas: [11] } ] } ✅
        // => { key: 'phone', rules: [['required'], ['length', [11]]] }
        password: [/^[0-9a-zA-Z]{6,18}$/, 'confirmed'],
        date: 'between:now,2019-01-01',
        startDate: 'before:now',
    },
    messages: {
        email: 'it is not a valid email',
        phone: {
            required: 'phone is not allowed empty',
            length: 'the length of phone must be 11'
        },
        password: 'password must be alphanumeric and the length is between 6 and 18',
        date: 'date must be between current time and 2019-01-01',
        startDate: 'startDate must be less than or equal to current time'
    }
}
```
