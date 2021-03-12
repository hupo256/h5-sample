const valueFlash = (dom, val, s) => {
  // console.log(dom.innerText, val, s)
  let v = 0 // 累计值
  let v2 = 16 // 执行毫秒值,不建议数字设置的过低
  s = Math.ceil(val / (s * 1000) * v2) // 计算每次递增量
  let timmer = setInterval(function() {
    v += s
    if (v >= val) {
      dom.innerText = val
      clearInterval(timmer)
    } else {
      dom.innerText = v
    }
  }, v2)
}

export default valueFlash
