/**
 *  created at 2018/06/22 18:45 by xxxxxMiss
 */

import Joi from 'joi-browser'
import schemas from './rules'
import { isRegex, isString } from '../../util/src/index'
import { parseRule, formatData, findSameRuleKey } from './helpers'

export default function install (Vue, options = {}) {
  Vue.prototype.$validate = (config, values, opts = {}) => {
    // merge Joi options, customize opts
    opts = Object.assign({}, options, opts)
    const keys = Object.keys(values)
    const ruleKeys = Object.keys(config.rules)
    values = formatData(ruleKeys, values)

    const parsedRules = []
    const result = []
    let error = null
    let sameRuleKey = null

    keys.forEach(k => {
      if (ruleKeys.indexOf(k) > -1) {
        parsedRules.push(parseRule(k, config.rules[k]))
      } else if (sameRuleKey = findSameRuleKey(ruleKeys, k)) {  // handle same rule
        parsedRules.push(parseRule(sameRuleKey, config.rules[sameRuleKey]))
      }
    })

    const len = parsedRules.length
    if (len > 0) {
      for (let i = 0; i < len; i++) {
        if (error && !opts.validateAll) {
          break
        }
        const current = parsedRules[i]
        for (let j = 0, l = current.length; j < l; j++) {
          const { key, rule, params } = current[j]
          const schema = schemas[rule].apply(this, params)
          const ret = Joi.validate(values[key], schema, opts)
          console.log(ret)
          error = ret.error
          if (error) {
            const msg = (config.messages || {})[key]
            result.push({
              key,
              value: ret.value,
              message: msg
                ? (isString(msg) ? msg : msg[rule])
                : error.details
            })
            if (!opts.validateAll) break
          }
        }
      }
    }

    return result
  }
}
