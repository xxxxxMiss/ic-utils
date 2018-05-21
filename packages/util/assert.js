export const isString = value => typeof value === 'string'

export const isPureObj = value => ({}).toString.call(value) === '[object Object]'

export const isFn = value => typeof value === 'function'