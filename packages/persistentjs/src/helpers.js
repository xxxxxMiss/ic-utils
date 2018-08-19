const s = 1000
const m = s * 60
const h = m * 60
const d = h * 24
const w = d * 7
const y = d * 365

export function parse (str) {
  str = String(str)
  if (str.length > 100) {
    return
  }
  const match = /^((?:\d+)?\-?\d?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
    str
  )
  if (!match) {
    return
  }
  const n = parseFloat(match[1])
  const type = (match[2] || 'ms').toLowerCase()
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y
    case 'weeks':
    case 'week':
    case 'w':
      return n * w
    case 'days':
    case 'day':
    case 'd':
      return n * d
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n
    default:
      return undefined
  }
}

export function maxAgeToGMT (maxAge) {
  return maxAge === Infinity
    ? 'Fri, 31 Dec 9999 23:59:59 GMT'
    : new Date(new Date(maxAge * 1e3) + Date.now()).toUTCString()
}

export function parseCookie (cookieStr = '', decode = window.atob) {
  const result = []
  const pieces = cookieStr.split(/\s*/)

  pieces.forEach(item => {
    const [key, value] = item.split('=')
    result.push([decode(key), decode(value)])
  })

  return result
}

export function deserialize (serializedJavascript) {
  return eval('(' + serializedJavascript + ')')
}
