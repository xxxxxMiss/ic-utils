export function computedDate (time) {
  const t = new Date(time)
  return {
    year: t.getFullYear(),
    month: t.getMonth() + 1
  }
}

export function getDateText (value, so_far) {
  if (!value) return ''
  if (so_far === 'Y') {
    return '至今'
  } else {
    const {
      year, month
    } = computedDate(value)
    return `${year}.${month}`
  }
}

export function getStrLen (str) {
  if (typeof str == 'number') str = '' + str
  if (!str || typeof str != 'string') return 0
  return str.replace(/[^\x00-\xff]/g, 'xx').length
}

export function getStrLen (str) {
  if (typeof str !== 'string') return 0
  return String(str).replace(/[^\x00-\xff]/g, 'xx').length
}

export function getDegree (id) {
  return degreeMap[id] || '学历不限'
}

export function getDegreeId (name) {
  let id
  Object.values(degreeMap).forEach((item, index) => {
    if (item === name) {
      id = Object.keys(degreeMap)[index]
    }
  })
  return id
}

export function getDegree (id) {
  let ret = null
  for (let key in degreeMap) {
    if (key === id) ret = degreeMap[key]
    else if (degreeMap[key] === id) ret = key
    break
  }
  return ret
}

export function getOld (value) {
  const {
    year, month
  } = computedDate(value), now = new Date()
  let old = now.getFullYear() - year
  if (now.getMonth() + 1 - month < 0) {
    old -= 1
  }
  return old
}

export function listSort (list = {}) {
  const newList = Object.keys(list).map((id) => {
    let obj = Object.assign({}, list[id], {
      id
    })
    delete obj['_id']
    delete obj['_start_time']
    return obj
  })
  return newList.sort((a, b) => {
    const aDate = computedDate(a.start_time),
      bDate = computedDate(b.start_time)
    return new Date(bDate.year, bDate.month - 1) - new Date(aDate.year, aDate.month - 1)
  })
}

export function commonListSortBy (list = {}, params) {
  const newList = Object.keys(list).map((id) => {
    let obj = Object.assign({}, list[id], {
      id
    })
    return obj
  })
  if (params) {
    return newList.sort((a, b) => {
      return a[params] - b[params]
    })
  }
  return newList
}

export function formatDetailList (list = {}) {
  list.map(item => {
    item.status = neitui[item.neitui_step] ? neitui[item.neitui_step].status : ''
    item.position = item.position_name
  })
  return list
}

export function formatCity (cityStr) {
  try {
    if (Array.isArray(cityStr)) return cityStr.join('、')
    cityStr = (typeof cityStr === 'object') ? cityStr : JSON.parse(cityStr)
    return Object.values(cityStr).join('、')
  } catch (e) {
    return ''
  }
}

export function formatSalary (begin, end) {
  begin = isNaN(begin) ? 0 : Math.round(begin / 1000)
  end = isNaN(end) ? 0 : Math.round(end / 1000)
  if (begin > 0 && end > 0) {
    return begin + (begin !== end ? ' - ' + end : '') + 'K'
  } else if (begin > 0) {
    return begin + 'K+'
  } else if (end > 0) {
    return end + 'K以内'
  } else {
    return '面议'
  }
}

export function formatExperience (begin = 0, end = 0) {
  let workLife = '经验不限'
  begin = +begin
  end = +end
  if (begin === 0 && end === 0) {
    workLife = '经验不限'
  } else if (begin === 0 && end) {
    workLife = end + '年以内'
  } else if (begin === end) {
    workLife = begin + '年'
  } else if (end === 0) {
    workLife = begin + '年以上'
  } else {
    workLife = begin + '-' + end + '年'
  }
  return workLife
}

export function dateFormat (timestamp, formats) {
  if (+timestamp === 0) return ''
  formats = formats || 'Y-m-d'
  var zero = function (value) {
    if (value < 10) {
      return '0' + value
    }
    return value
  }
  var myDate = new Date(+timestamp * 1000)
  var year = myDate.getFullYear()
  var month = zero(myDate.getMonth() + 1)
  var day = zero(myDate.getDate())
  var hour = zero(myDate.getHours())
  var minite = zero(myDate.getMinutes())
  var second = zero(myDate.getSeconds())
  return formats.replace(/Y|m|d|H|i|s/ig,
    function (matches) {
      return ({
        Y: year,
        m: month,
        d: day,
        H: hour,
        i: minite,
        s: second
      })[matches]
    })
}

export function formatCityJson () {
  const cities = []
  Object.keys(city_list).forEach(item => {
    const obj = {
      title: item,
      children: city_list[item]
    }
    cities.push(obj)
  })
  if (HOT_list) {
    cities.unshift({
      icon: 'star',
      title: '热门城市',
      children: HOT_list
    })
  }
  return cities
}

export function getCityName (id) {
  if (!id) return
  id = '' + id
  const city = formatCityJson(city_list, HOT_list)
  let name = ''
  if (id.indexOf(',') > -1) {
    const cityArray = id.split(',')
    cityArray.map(item => {
      name += getCityName(item) + '、'
    })
  } else {
    city.forEach(item => {
      item.children.forEach(item => {
        if (item.id == id) name = item.name
      })
    })
  }
  return name
}


export function getResumeDegree (education) {
  education = listSort(education)
  if (education.length < 1) return
  return getDegree(education[0].degree)
}


/**
 * 日期格式化
 * @param time 日期文本
 * @returns {String} 格式化的日期
 */
export function formatTimePosition (time) {
  if (!time) return ''
  let updateTime = time * 1000
  if (time.toString().indexOf('-') > -1) {
    updateTime = new Date(Date.parse(time.replace(/-/g, '/'))).getTime()
  }

  const minute = 1000 * 60
  const hour = minute * 60
  const day = hour * 24
  const week = day * 7
  const month = day * 30
  const now = new Date().getTime()
  const diffValue = now - updateTime

  if (diffValue < 0) {
    return ''
  }

  const monthC = diffValue / month
  const weekC = diffValue / week
  const dayC = diffValue / day
  const hourC = diffValue / hour
  const minC = diffValue / minute
  let result
  if (monthC > 12) {
    // result = /\d{4}-\d{1,2}-\d{1,2}/g.exec(time)[0];
    result = '1年前'
  } else if (monthC >= 1) {
    // result = parseInt(monthC) + '个月前'
    result = '3天前'
  } else if (weekC >= 1) {
    result = parseInt(weekC) + '周前'
  } else if (dayC >= 1) {
    result = parseInt(dayC) + '天前'
  } else if (hourC >= 1) {
    result = parseInt(hourC) + '小时前'
  } else if (minC >= 1) {
    result = parseInt(minC) + '分钟前'
  } else {
    result = '刚刚'
  }
  return result
}
/**
 * 格式化薪资
 * @param begin {Number} 最低薪资
 * @param end {Number} 最高薪资
 * @returns {String} 薪资区间
 */
export function formatSalaryPosition (begin, end) {
  begin = isNaN(begin) ? 0 : (begin / 1000).toFixed(0)
  end = isNaN(end) ? 0 : (end / 1000).toFixed(0)
  if (begin == 1 && end == 500) {
    return '面议'
  } else if (begin > 0 && end > 0) {
    return begin + (begin !== end ? ' - ' + end : '') + 'K'
  } else if (begin > 0) {
    return begin + 'K+'
  } else if (end > 0) {
    return end + 'K以内'
  } else {
    return '面议'
  }
}
/**
 * 格式化工作经验
 * @param begin {Number} 最少工作经验
 * @param end {Number} 最多工作经验
 * @param above {String} 是否包含指定工作经验以上
 * @returns {String} 格式化后的输出
 */
export function formatExperience (begin, end) {
  begin = isNaN(begin) ? 0 : begin
  end = isNaN(end) ? 0 : end
  const experienceTexts = [
    `${end}年以内`,
    `${begin}-${end}年`,
    `${begin}年以上`,
    '经验不限'
  ]
  if (begin === 0 && end !== 0) {
    return experienceTexts[0]
  }
  if (begin > 0 && end > begin) {
    return experienceTexts[1]
  }
  if (begin > 0) {
    return experienceTexts[2]
  }
  return experienceTexts[4]
}

/**
 * 格式化地点
 * @param item {object} 地点
 * @returns {String} 格式化后的输出
 */
export function formatcity (item) {
  let city = []
  for (let index in item) {
    city.push(item[index])
  }
  return city.join('、')
}

export function formatCityJson () {
  const cities = []
  Object.keys(city_list).forEach(item => {
    const obj = {
      title: item,
      children: city_list[item]
    }
    cities.push(obj)
  })
  if (HOT_list) {
    cities.unshift({
      title: '热',
      children: HOT_list
    })
  }
  return cities
}

export function getCityName (id) {
  if (!id) return
  id = '' + id
  const city = formatCityJson(city_list, HOT_list)
  let name = ''
  if (id.indexOf(',') > -1) {
    const cityArray = id.split(',')
    cityArray.map(item => {
      name += getCityName(item) + '、'
    })
  } else {
    city.forEach(item => {
      item.children.forEach(item => {
        if (item.id == id) name = item.name
      })
    })
  }
  return name
}

export function listSort (list = {}) {
  const newList = Object.keys(list).map((id) => {
    let obj = Object.assign({}, list[id], {
      id
    })
    delete obj['_id']
    delete obj['_start_time']
    return obj
  })
  return newList.sort((a, b) => {
    const aDate = computedDate(a.start_time),
      bDate = computedDate(b.start_time)
    return new Date(bDate.year, bDate.month - 1) - new Date(aDate.year, aDate.month - 1)
  })
}

export function formatResumeExperience (work) {
  work = listSort(work)
  if (work.length < 1) return
  const month1 = work[0].so_far === 'Y' ? new Date().getFullYear() - 1900 * 12 + new Date().getMonth() + 1 : (+computedDate(work[0].end_time).year - 1900) * 12 + (+computedDate(work[0].end_time).month)
  const month2 = (+computedDate(work[work.length - 1].start_time).year - 1900) * 12 + (+computedDate(work[work.length - 1].start_time).month)
  const month = month1 - month2
  if (month < 12) {
    return '无经验'
  } else if (month >= 12 && month <= 36) {
    return '1-3年'
  } else if (month > 36 && month <= 60) {
    return '3-5年'
  } else if (month > 60 && month <= 120) {
    return '5-10年'
  } else {
    return '10年以上'
  }
}

export function getResumeDegree (education) {
  education = listSort(education)
  if (education.length < 1) return
  return formatDegree(education[0].degree)
}
