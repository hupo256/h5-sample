import axios from 'axios'
import { Toast } from 'antd-mobile'
import config from '../utils/config'
import UA from '../utils/ua'
import fun from '@src/common/utils'

const { isAndall } = UA
const { getStorage } = fun
const { host } = config

// 获取token
const getToken = () => {
  let token = window.localStorage.getItem('token')
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
    console.log(response)
    const { config, data } = response
    const { code, message } = data
    Toast.hide()
    if (+code) {
      const { params = {} } = config
      if (!params.noloading && !params.withoutBack) {
        Toast.fail(message, 2)
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
    return { data: data.data, code, message }
  },
  async (error) => {
    Toast.hide()
    return console.log(error)
  },
)

export default ajaxinstance
