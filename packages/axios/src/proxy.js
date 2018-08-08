import { hash } from 'object-hash'
import Cache from './cache'

let cache = null

export default function axiosProxy(axiosInstance, options) {
  return new Proxy(axiosInstance, {
    get(target, prop) {
      if (prop.toLowerCase() === 'get') {
        return proxyAction(target[prop], options)
      }
      return target[prop]
    }
  })
}

function proxyAction(obj, options) {
  if (!cache) {
    cache = new Cache(options)
  }
  return new Proxy(obj, {
    apply(target, thisArg, args) {
      const argsHash = hash(args)
      if (cache.has(argsHash)) {
        return Promise.resolve(cache.get(argsHash))
      }
      return target(...args).then(res => {
        cache.set(argsHash, res)
        return res
      })
    }
  })
}
