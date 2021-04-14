import config from '@src/common/utils/config'
import fun from '@src/common/utils'

const { getStorage } = fun
const { host } = config
// const host = '//testgw.ingongdi.com/'

/**
 * 封装fetch
 * @param {*} url
 * @param {*} opt
 */
export const creatFech = async (url, opt) => {
  const { method = 'get', body, query } = opt || {}
  let Url = url
  const setConfig = { method }
  if (query)
    Url += `?${Object.keys(query)
      .map((key) => key + '=' + query[key])
      .join('&')}`
  if (body) setConfig.body = JSON.stringify(body)
  const data = await fetch(`${host}${Url}`, {
    ...setConfig,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      appId: getStorage('appId'),
    },
  })
    .then((res) => res.json())
    .then((res) => res)
    .catch((err) => {
      console.log(err)
    })

  return data
}

export default creatFech
