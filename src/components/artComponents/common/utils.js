const tools = {}

tools.baseImgUrl = 'https://img.inbase.in-deco.com/crm_saas/release/'

// localStorage
tools.setStorage = (key, value) => {
  window.localStorage.setItem(key, JSON.stringify(value))
}
tools.getStorage = key => {
  let data = window.localStorage.getItem(key)
  return data && data !== 'undefined' ? JSON.parse(data) : ''
}

tools.urlParamHash = (url = location.href) => {
  let params = {}
  let hash = url.slice(url.indexOf('?') + 1).split('&')
  for (let i = 0; i < hash.length; i++) {
    const h = hash[i].split('=') //
    params[h[0]] = h[1]
  }
  return params
}

tools.openNewPage = (url, pageName = 'viewPage') => {
  window.open(url, pageName)
}

export default tools
