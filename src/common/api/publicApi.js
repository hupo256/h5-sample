import ajaxinstance from './index'

const publiceCreate = () => {
  // const publiceCreate = (ajaxinstance) => {
  const publice = {}
  // 获取微信签名
  publice.createJsapiSignature = (params) => ajaxinstance.get('wx/createJsapiSignature', { params })
  // 获取token
  publice.publicauth = (params) => ajaxinstance.get('wx/publicauth', { params })
  // 授权
  publice.publicauthurl = (params) => ajaxinstance.get('wx/publicauthurl', { params })
  return publice
}

export default publiceCreate()
