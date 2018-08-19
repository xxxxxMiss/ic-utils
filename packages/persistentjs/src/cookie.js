import { maxAgeToGMT, parse, parseCookie } from './helpers'

export default class Cookie {
  constructor () {
    const cookies = parseCookie(document.cookie)
    this.cookies = new Map(cookies)
  }

  setItem (key, value, config = {}) {
    try {
      const result = JSON.stringify(value)
      if (/^[\[\{]/.test(result)) {
        value = result
      }
    } catch (error) {
      throw error
    }
    
    let pair = `${window.btoa(key)}=${window.btoa(value)}`

    for (const name in config) {
      if (config[name] && config[name] !== true) {
        pair += `; ${name}=${config[name]}`
      } else if (config[name]) {
        pair += `; ${config[name]}`
      }
    }
    document.cookie = pair

    if (value) {
      this.cookies.set(key, value)
    }
  }

  getItem (key) {
    return this.cookies.get(key) || null
  }

  removeItem (key, config) {
    this.setItem(key, '', config)
    this.cookies.delete(key)
  }

  clear () {
    [...this.cookies.keys()].forEach(key => {
      this.setItem(key, '')
    })
    this.cookies.clear()
  }

  length () {
    return this.cookies.size
  }

  key (index) {
    return [...this.cookies.keys()][index]
  }
}
