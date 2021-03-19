const fun = {}

// 获取url参数
fun.getParams = (link) => {
  const obj = {}
  let name, value
  let str = link || location.href // 取得整个地址栏
  let num = str.indexOf('?')
  str = str.substr(num + 1) // 取得所有参数   stringvar.substr(start [, length ]
  let arr = str.split('&') // 各个参数放到数组里
  for (var i = 0; i < arr.length; i++) {
    num = arr[i].indexOf('=')
    if (num > 0) {
      name = arr[i].substring(0, num)
      value = arr[i].substr(num + 1)
      obj[name] = value
    }
  }
  return obj
}
// 时间格式化
fun.fmtDate = (time, str) => {
  if (!time) {
    return ''
  }
  const y = time.getFullYear()
  const m = time.getMonth() + 1
  const d = time.getDate()
  if (str) {
    return `${y}${str}${m < 10 ? '0' + m : m}${str}${d < 10 ? '0' + d : d}`
  } else {
    return `${y}-${m < 10 ? '0' + m : m}-${d < 10 ? '0' + d : d}`
  }
}

// session storage
fun.setStorage = (key, value) => {
  window.localStorage.setItem(key, JSON.stringify(value))
}
fun.getStorage = (key) => {
  let data = window.localStorage.getItem(key)
  return data && data !== 'undefined' ? JSON.parse(data) : ''
}

// fixScroll ios12.2.2版本滚动
fun.fixScroll = () => {
  let t, l, w, h
  if (document.documentElement && document.documentElement.scrollTop) {
    t = document.documentElement.scrollTop
    l = document.documentElement.scrollLeft
    w = document.documentElement.scrollWidth
    h = document.documentElement.scrollHeight
  } else if (document.body) {
    t = document.body.scrollTop
    l = document.body.scrollLeft
    w = document.body.scrollWidth
    h = document.body.scrollHeight
  }
  return {
    top: t,
    left: l,
    width: w,
    height: h,
  }
}

// 系列化参数
fun.parseQuery = (params = {}) => {
  let url = ''
  for (let i in params) {
    url += `${i}=${params[i]}&`
  }
  return url.substring(0, url.length - 1)
}

// 省市区三级联动数据包装
fun.formatAddres = (addressData) => {
  const adders = []
  for (let province in addressData) {
    const label = addressData[province].name
    const city = addressData[province].city
    const children = []
    for (let n = 0, len = city.length; n < len; n++) {
      const cityList = {
        label: city[n].name,
        value: `${city[n].name}`,
        children: [],
      }
      if (city[n].area && city[n].area.length) {
        for (let i = 0, lens = city[n].area.length; i < lens; i++) {
          cityList.children.push({
            label: city[n].area[i],
            value: `${city[n].area[i]}`,
          })
        }
      }
      children.push(cityList)
    }
    const data = {
      label,
      value: label,
      children,
    }
    adders.push(data)
  }
  return adders
}

// 数字达到1000以上转化成k
fun.numToStringK = (num) => {
  if (+num < 1000 || !num) {
    return num
  } else if (num > 999 && num < 10000) {
    return (num / 1000).toFixed(1) + '千'
  } else {
    return (num / 10000).toFixed(1) + '万'
  }
}

// 预约专家显示最近n天的工作日时间
fun.getDayListExport = (num) => {
  num = num + 2
  const date = new Date()
  const curTime = date.getTime()
  const hours = date.getHours() + 1
  const dayList = []
  // const bool = hours >= 17
  const bool = true
  // 获取时间段
  let hoursList = []
  for (let i = 10; i < 17; i++) {
    const nowTime = i + ':00-' + (i + 1) + ':00'
    hoursList.push({ value: nowTime, label: nowTime, bool: hours > i })
  }
  // 获取天数
  for (let i = bool ? 1 : 0; i < (bool ? num + 1 : num); i++) {
    let date = curTime + i * 3600 * 24 * 1000
    date = new Date(date)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const week = date.getDay()
    if (week !== 6 && week !== 0) {
      const time = `${year}-${month}-${day}`
      dayList.push({
        value: time,
        label: time,
        children: !bool && !i ? hoursList.filter((item) => !item.bool) : hoursList,
      })
    }
  }
  return dayList.slice(0, num - 2)
}

// 显示圣诞节，元旦，还是正常（1：圣诞节， 2：元旦， 3：正常）
fun.returnNumByDay = () => {
  if (new Date() <= new Date('2019/12/26 00:00:00')) {
    return 1
  } else if (new Date('2019/12/26 00:00:00') < new Date() && new Date() <= new Date('2020/01/03 00:00:00')) {
    return 2
  } else {
    return 3
  }
}

// 如果当前时间在所设定的日期里，就返回true
fun.touchTheTimePosition = (start = '2020-01-23', end = '2020-01-30') => {
  const n = new Date().getTime()
  const s = new Date(start).getTime()
  const e = new Date(end).getTime()
  return n > s && n < e
}
// 获取今天的日期
fun.todayDate = () => {
  return fun.fmtDate(new Date())
}

export default {
  ...fun,
}
