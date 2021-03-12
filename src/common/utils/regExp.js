const regExps = {}

// 验证码
regExps.code = /^\d{5}$/
// 手机号码
regExps.phone = /^[1][2-9][0-9]{9}$/
// 金额(最多两位小数)
regExps.price = /^(([1-9]\d*)(\.\d{1,2})?)$|(0\.0?([1-9]\d?))$/
// 去除空格
regExps.space = /(^\s*)|(\s*$)/g

export default {
  ...regExps
}
