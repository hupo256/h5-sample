import axios from 'axios'
import { Toast } from 'antd-mobile'
import config from '../utils/config'
import UA from '../utils/ua'
import fun from '@src/common/utils'

const { isAndall } = UA
const { getSession } = fun
const { host } = config

// 获取token
const getToken = () => {
  let token = window.localStorage.getItem('token')
  if (isAndall()) {
    token ||
      setTimeout(() => {
        andall.invoke('token', {}, function (res) {
          window.localStorage.setItem('token', res.result.token)
          token = res.result.token
        })
      }, 100)
  }
  return token
}

// 实例化 ajax请求对象
const ajaxinstance = axios.create({
  baseURL: host,
  timeout: 20000,
  data: {},
  headers: {
    responseType: 'json',
  },
})

// 请求拦截器
ajaxinstance.interceptors.request.use(
  (request) => {
    const token = getToken()
    const { params = {} } = request
    if (!params.noloading) Toast.loading('加载中...', 20)
    token && (request.headers['Token'] = token) // (location.href = '/#/')
    request.headers['pageInfo'] = JSON.stringify(getSession('pageInfo'))
    return request
  },
  (error) => {
    Toast.hide()
    console.log(error)
  },
)

// 响应拦截器
ajaxinstance.interceptors.response.use(
  (response) => {
    const { config, data } = response
    const { code, result, msg } = data
    Toast.hide()
    if (+code) {
      const { params = {} } = config
      if (!params.noloading && !params.withoutBack) {
        Toast.fail(msg, 2)
      }
      if (+code === 100001) {
        if (isAndall()) {
          window.localStorage.setItem('token', '')
          if (!params.withoutBack) andall.invoke('back')
          andall.invoke('login', {}, (res) => {
            window.localStorage.setItem('token', res.result.token)
            window.location.reload()
          })
        }
      }
    }
    return { data: result, code, msg }
  },
  async (error) => {
    Toast.hide()
    const { params } = error
    if (params && params.inAndall) {
      return await new Promise((resolve) => {
        // 返回Promise对象，以便等待APP数据
        let pageInfo = getSession('pageInfo')
        andall.invoke('touchPageId', pageInfo, (res) => {
          resolve({ data: res, code: 0, msg: 'ok' })
        })
      })
    }

    return console.log(error)
  },
)

export default ajaxinstance
