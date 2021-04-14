// 接口host
const isProd = IS_ENV === 'prod'
const prefix = IS_ENV === 'local' ? 'test' : IS_ENV
const host = isProd ? '//gateway.ingongdi.com/' : `//${prefix}gw.ingongdi.com/`

export default { host }
