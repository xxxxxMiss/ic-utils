export function parseRule (ruleStr = '') {
  let [rule, params] = ruleStr.split(':')
  rule = rule.split('|')
  params = params.split(',')
  return { rule, params }
}