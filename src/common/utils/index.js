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

// 系列化参数
fun.parseQuery = (params = {}) => {
  let url = ''
  for (let i in params) {
    url += `${i}=${params[i]}&`
  }
  return url.substring(0, url.length - 1)
}

fun.urlParamHash = (url = location.href) => {
  const obj = {}
  const hash = url.slice(url.indexOf('?') + 1).split('&')
  for (let i = 0, k = hash.length; i < k; i++) {
    const arr = hash[i].split('=')
    obj[arr[0]] = arr[1]
  }
  return obj
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

export default {
  ...fun,
}
