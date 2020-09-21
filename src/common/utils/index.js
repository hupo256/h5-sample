import ua from '@src/common/utils/ua'
import andall from '@src/common/utils/andall-sdk'
import addressData from '@src/assets/json/city.json'
const { getOsVersion, isIos, isAndall } = ua
const fun = {}

// 滚动动画
fun.scrollTo = (scroll, time) => {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
  const distance = scroll - scrollTop
  const scrollCount = time / 10
  const everyDistance = (distance / scrollCount) | 0
  const cz = distance - (everyDistance * scrollCount)
  let bool = false
  if (isIos() && +getOsVersion().split('.')[0] < 12) {
    bool = true
  }
  if (bool) {
    window.scrollBy(0, distance)
  } else {
    for (let index = 0; index <= scrollCount - 1; index++) {
      setTimeout(function () {
        window.scrollBy(0, !index ? cz + everyDistance : everyDistance)
      }, index * 22)
    }
  }
}
// 获取url参数
fun.getParams = link => {
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
fun.setSetssion = (key, value) => {
  window.localStorage.setItem(key, JSON.stringify(value))
}
fun.getSetssion = (key) => {
  let data = window.localStorage.getItem(key)
  return data && data !== 'undefined' ? JSON.parse(data) : ''
}
// session storage
fun.setSession = (key, value) => {
  window.sessionStorage.setItem(key, JSON.stringify(value))
}
fun.getSession = (key) => {
  let data = window.sessionStorage.getItem(key)
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
    height: h
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
fun.formatAddres = () => {
  const adders = []
  for (let province in addressData) {
    const label = addressData[province].name
    const city = addressData[province].city
    const children = []
    for (let n = 0, len = city.length; n < len; n++) {
      const cityList = {
        label: city[n].name,
        value: `${city[n].name}`,
        children: []
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
      children
    }
    adders.push(data)
  }
  return adders
}

fun.creatTimeSelecter = (start, end) => {
  const Arr = []
  const year = []
  const month = []
  const day = []
  for (let i = start; i < end; i++) {
    const tex = i + '年'
    year.push({
      label: tex,
      value: i,
    })
  }
  Arr.push(year)
  for (let i = 1; i < 13; i++) {
    const tex = i + '月'
    month.push({
      label: tex,
      value: i,
    })
  }
  Arr.push(month)
  for (let i = 1; i < 32; i++) {
    const tex = i + '日'
    day.push({
      label: tex,
      value: i,
    })
  }
  Arr.push(day)
  return Arr
}

fun.getDayNumber = (dateArr, num) => {
  switch (num) {
    case 2:
      return dateArr[2].slice(0, 29)
    case 4:
    case 6:
    case 9:
    case 11:
      return dateArr[2].slice(0, 30)
    default:
      return dateArr[2]
  }
}

fun.isPoneAvailable = (poneInput) => {
  var myreg = /^[1][0-9]{10}$/
  if (!myreg.test(poneInput)) {
    return false
  } else {
    return true
  }
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
    let date = curTime + (i * 3600 * 24 * 1000)
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
        children: !bool && !i ? hoursList.filter(item => !item.bool) : hoursList
      })
    }
  }
  return dayList.slice(0, num - 2)
}
// 显示圣诞节，元旦，还是正常（1：圣诞节， 2：元旦， 3：正常）
fun.returnNumByDay = () => {
  if (new Date() <= new Date('2019/12/26 00:00:00')) {
    return 1
  } else if ((new Date('2019/12/26 00:00:00') < new Date()) && (new Date() <= new Date('2020/01/03 00:00:00'))) {
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

// 根据传入的url返回大写的路由
fun.touchTheRout = url => {
  let { pathname } = window.location
  url && (pathname = url.includes('?') ? url.split('?')[0] : url)
  const pnArr = pathname.split('/')
  let rKey = pnArr.pop()
  if (!rKey) rKey = pnArr.pop()
  return `H5_${rKey.replace(/-/g, '_').toUpperCase()}`
}

// 设置埋点的页面ID
fun.getPpid = () => {
  let ppidArr = fun.getSession('ppidArr')
  if (ppidArr && ppidArr.split(',').pop() !== location.href) {
    ppidArr += `,${location.href}`
  }  
  ppidArr || (ppidArr = location.href)  // 这应该是第一次进来
  fun.setSession('ppidArr', ppidArr)

  // console.log(ppidArr.split(','))
  const pArr = ppidArr.split(',')
  const ind = pArr.length - 2
  const ppid = ind < 0 ? '' : fun.touchTheRout(pArr[ind])
  return ppid
}

// 获取埋点的页面ID
fun.togetPageIds = () => {
  const ppid = fun.getPpid()
  const cpid = fun.touchTheRout()
  const addObj = { ppid, cpid }
  let pageInfo = fun.getSession('pageInfo')
  if (!pageInfo) {  // 没有则设置
    const cpid = fun.touchTheRout()
    pageInfo = {
      strTime: new Date().getTime(),
      anonymousId: `anonymousId_${Math.random()*100000}`,
      opid: cpid,
      ...addObj,
    }
  } else {  // 有则刷新
    Object.assign(pageInfo, {cpid})
    ppid && Object.assign(pageInfo, {ppid})  //不为空则加
  }

  fun.setSession('pageInfo', pageInfo)  // 顺便保存在session里
  return pageInfo
}

fun.isTheAppVersion = (version, equal = true) => {
  if (isAndall()) { 
    const curVer = +andall.info.version.replace(/\./g, '')
    const theVer = +version.replace(/\./g, '')
    const distance = curVer - theVer
    return equal ? distance >= 0 : distance > 0
  }
}

export default {
  ...fun
}
