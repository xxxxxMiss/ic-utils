export function getVerboseErrorMsg (results) {
  const errorMsg = []
  if (Array.isArray(results)) {
    results.forEach(ret => errorMsg.push(getVerboseErrorMsg(ret)))
  } else if (Object.prototype.toString.call(results) === '[object Object]') {
    for (const key in results) {
      errorMsg.push(getVerboseErrorMsg(results[key]))
    }
  } else {
    errorMsg.push(results)
  }
  return errorMsg.join('、')
}

export function handleError(error) {
  let msg = error.message
  if (error.message.indexOf('Network Error') > -1) {
    msg = '网络出了一点小问题~'
  } else if (error.message.indexOf('timeout of') > -1) {
    msg = '请求超时~'
  } else {
    console.error(msg)
  }
  return msg
}
