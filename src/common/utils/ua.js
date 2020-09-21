import UAParser from 'ua-parser-js'
import andall from '@src/common/utils/andall-sdk'

/**
 *  useragent 帮助类
 */
const uaParer = new UAParser()
const UA = {
  isIos:() => {
    return uaParer.getOS().name === 'iOS'
  },
  isAndroid:() => {
    return uaParer.getOS().name === 'Android'
  },
  isAndall:() => {
    return andall.info.isAndall
  },
  isWechat: () => {
    return uaParer.getBrowser().name === 'WeChat'
  },
  getOsName:() => {
    return uaParer.getOS().name
  },
  getOsVersion:() => {
    return uaParer.getOS().version
  },
  getDevice:() => {
    return uaParer.getDevice()
  },
}

export default UA
