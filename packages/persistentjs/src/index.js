/**
 *  created at 2018/08/14 11:56 by xxxxxMiss
 */
import Storage from './storage'
import Cookie from './cookie'

let storageInstance = null
let storageType = 'local'

export default function persist (options = {}) {
  const type = options.storage

  if (storageInstance && type === storageType) {
    return storageInstance
  }

  return type === 'cookie'
    ? (storageInstance = new Cookie())
    : (storageInstance = new Storage(type))
}
