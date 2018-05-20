const isString = value => typeof value === 'string'

const isPureObj = value => ({}).toString.call(value) === '[Object object]'

const isFn = value => typeof value === 'function'