const _toString = value => ({}).toString.call(value)

export const isString = value => typeof value === 'string'

export const isPureObj = value => _toString(value) === '[object Object]'

export const isFn = value => typeof value === 'function'

export const isBool = value => typeof value === 'boolean'

export const isArray = value => Array.isArray(value)

export const isRegex = value => _toString(value) === '[object RegExp]'