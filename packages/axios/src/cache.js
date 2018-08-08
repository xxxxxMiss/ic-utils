export default class Cache {
  constructor (options = {}) {
    super()
    this.cache = new Map()
    this.options = options
  }

  set (key, value) {
    if (!this.has(key)) {
      this.cache.set(key, value)

      let maxAge = false
      if ((maxAge = this.options.maxAge) && Number.isFinite(maxAge))
      setTimeout(() => {
        this.delete(key)
      }, maxAge)
    }

    if (this.size() > this.options.size) {
      const oldKey = [...this.cache.keys()].shift()
      this.delete(oldKey)
    }
  }

  get (key) {
    if (key) {
      return this.cache.get(key)
    }
  }

  delete (key) {
    return key ? this.cache.delete(key) : this.cache.clear()
  }

  has (key) {
    return this.cache.has(key)
  }

  size () {
    return this.cache.size
  }
}
