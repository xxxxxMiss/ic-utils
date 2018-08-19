/**
 *  created at 2018/08/14 11:56 by xxxxxMiss
 */
import Storage from './storage'
import Cookie from './cookie'

let storageInstance = null

export default function persisten (options = {}) {
  if (storageInstance) {
    return storageInstance
  }

  const type = options.storage
  return type === 'cookie'
    ? (storageInstance = new Cookie())
    : (storageInstance = new Storage(type))
}
