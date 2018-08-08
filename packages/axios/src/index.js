import axios from 'axios'
import qs from 'qs'
import { handleError } from './error'
import { isFormData, isFunction } from './helper'
import axiosProxy from './proxy'

const options = {
  baseURL: '/api',
  withCredentials: true,
  paramsSerializer: function (params) {
    return qs.stringify(params)
  },
  transformRequest: [function (data) {
    // let browser set `Content-Type` if the type of data is FormData
    return isFormData(data) ? data : qs.stringify(data)
  }]
}

const DEFAULT_CONFIG = {
  enableCache: true,
  maxAge: false,
  maxSize: 1000,
  showLoading: true,
  loading: {
    show () {},
    hide () {}
  },
  toast () {} ,
  reqInterceptors: [],
  resInterceptors: [],
  onUploadProgress () {}
}

const ax = (opts = {}) => {
  opts = Object.assign({}, DEFAULT_CONFIG, opts)
  
  options.onUploadProgress = opts.onUploadProgress
  const instance = axios.create(options)

  instance.interceptors.request.use(config => {
    opts.showLoading && opts.loading.show()
    return config
  }, error => {
    opts.showLoading && opts.loading.hide()
    opts.toast(handleError(error))
  })
  if (opts.reqInterceptors.length > 0) {
    opts.reqInterceptors.forEach(interceptor => {
      instance.interceptors.request.use(interceptor)
    })
  }

  instance.interceptors.response.use(response => {
    opts.showLoading && opts.loading.hide()
    return response
  }, error => {
    opts.showLoading && opts.loading.hide()
    opts.toast(handleError(error))
  })
  if (opts.resInterceptors.length > 0) {
    opts.resInterceptors.forEach(interceptor => {
      instance.interceptors.response.use(interceptor)
    })
  }

  return opts.enableCache ? axiosProxy(instance, opts) : instance
}

export default ax
