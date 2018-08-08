import { isString, isPureObj, isArray } from '../../util/src/index'

export function parseRule (key, rules) {
  if (isString(rules)) {
    const group = rules.split('|')
    return group.map(value => {
      const [rule, params] = value.split(':')
      return { key, rule, params: params ? params.split(',') : [] }
    })
  }
  
  if (isPureObj(rules)) {
    return Object.keys(rules).map(rule => {
      let params = rules[rule]
      if (params || params === 0) {
        params = isArray(params) ? params : [params]
        // handle same rule: oldPwd:newPwd
        if (key.indexOf(':') > -1) {
          params.push(key)
        }
        return {
          key,
          rule,
          params
        }
      }
    })
  }
}

export function formatData (ruleKeys, data) {
  const sameRuleKeys = ruleKeys.filter(k => k.indexOf(':') > -1)

  if (sameRuleKeys.length > 0) {
    data = clone(data)
    for (let i = 0; i < sameRuleKeys.length; i++) {
      const [k1, k2] = sameRuleKeys[i].split(':')
      if (k1 in data && k2 in data) {
        data[sameRuleKeys[i]] = {
          [k1]: data[k1],
          [k2]: data[k2]
        }
        delete data[k1]
        delete data[k2]
      }
    }
    return data
  }

  return data
}

export function clone (value) {
  if (isArray(value)) {
    return value.map(clone)
  } else if (isPureObj(value)) {
    const res = {}
    for (const key in value) {
      res[key] = clone(value[key])
    }
    return res
  } else {
    return value
  }
}

export function findSameRuleKey (ruleKeys, key) {
  return ruleKeys.filter(k => k.indexOf(':') > -1)
    .find(sameRuleKey => sameRuleKey.split(':').indexOf(key) > -1)
}
