import Joi from 'joi-browser'

const required = () => Joi.string().required()

const min = limit => Joi.string().min(+limit)

const max = limit => Joi.string().max(+limit)

const length = (limit, encoding) => Joi.string().length(+limit, encoding)

const minVal = limit => Joi.number().min(+limit)

const maxVal = limit => Joi.number().max(+limit)

const range = (min, max) => minVal(+min).concat(maxVal(+max))

const email = options => Joi.string().email(options)

const regex = pattern => Joi.string().regex(pattern)

const after = date => Joi.date().greater(date)

const before = date => Joi.date().less(date)

const between = (start, end) => Joi.date().min(start).concat(Joi.date().max(end))

const tel = () => regex(/^(11|13|14|15|17|18|19)[0-9]{9}$/)

const same = (pattern, keys) => {
  const [oldKey, newKey] = keys.split(':')
  return Joi.object().keys({
    [oldKey]: pattern,
    [newKey]: Joi.ref(oldKey)
  })
}

export default {
  required,
  min,
  max,
  length,
  minVal,
  maxVal,
  range,
  email,
  regex,
  after,
  before,
  between,
  tel,
  same
}
