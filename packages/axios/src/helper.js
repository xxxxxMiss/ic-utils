export function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData)
}

export function isFunction(val) {
  return typeof val === 'function'
}
