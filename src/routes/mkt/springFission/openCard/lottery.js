export class Lottery {
  constructor(config){
    const {id, cover, coverType, width, height, drawPercentCallback} = config
    this.conNode = document.getElementById(id)
    this.cover = cover
    this.coverType = coverType
    this.width = width || 300
    this.height = height || 100
    this.drawPercentCallback = drawPercentCallback

    this.lotteryType = 'image'
    this.lottery = null
    this.background = null
    this.backCtx = null
    this.mask = null
    this.maskCtx = null
    this.clientRect = null
  }

  init = (lottery, lotteryType) => {
    this.lottery = lottery
    this.lotteryType = lotteryType || 'image'
    this.drawLottery()
  }

  createElement = (tagName, attributes) => {
    const ele = document.createElement(tagName)
    for (let key in attributes) {
      ele.setAttribute(key, attributes[key])
    }
    return ele
  }

  getTransparentPercent = (ctx, width, height) => {
    const imgData = ctx.getImageData(0, 0, width, height)
    const pixles = imgData.data
    const transPixs = []
    for (let i = 0, j = pixles.length; i < j; i += 4) {
      const a = pixles[i + 3]
      if (a < 128) {
        transPixs.push(i)
      }
    }
    return (transPixs.length / (pixles.length / 4) * 100).toFixed(2)
  }

  resizeCanvas = (canvas, width, height) => {
    canvas.width = width
    canvas.height = height
    canvas.getContext('2d').clearRect(0, 0, width, height)
  }

  drawPoint = (x, y) => {
    this.maskCtx.beginPath()
    const radgrad = this.maskCtx.createRadialGradient(x, y, 0, x, y, 30)
    radgrad.addColorStop(0, 'rgba(0,0,0,0.6)')
    radgrad.addColorStop(1, 'rgba(255, 255, 255, 0)')
    this.maskCtx.fillStyle = radgrad
    this.maskCtx.arc(x, y, 40, 0, Math.PI * 2, true)
    this.maskCtx.fill()
    if (this.drawPercentCallback) {
      this.drawPercentCallback.call(null, this.getTransparentPercent(this.maskCtx, this.width, this.height))
    }
  }

  bindEvent = () => {
    const device = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i
      .test(navigator.userAgent.toLowerCase()))
    const clickEvtName = device ? 'touchstart' : 'mousedown'
    const moveEvtName = device ? 'touchmove' : 'mousemove'
    let isMouseDown = false
    if (!device) {
      document.addEventListener('mouseup', function (e) {
        isMouseDown = false
      }, false)
    } else {
      document.addEventListener('touchmove', function (e) {
        if (isMouseDown) {
          e.preventDefault()
        }
      }, false)
      document.addEventListener('touchend', function (e) {
        isMouseDown = false
      }, false)
    }
    this.mask.addEventListener(clickEvtName, e => {
      isMouseDown = true
      const docEle = document.documentElement
      if (!this.clientRect) {
        this.clientRect = {
          left: 0,
          top:0
        }
      }
      const x = (device ? e.touches[0].clientX : e.clientX) -
      this.clientRect.left + docEle.scrollLeft - docEle.clientLeft
      const y = (device ? e.touches[0].clientY : e.clientY) -
       this.clientRect.top + docEle.scrollTop - docEle.clientTop
      this.drawPoint(x, y)
    }, false)

    this.mask.addEventListener(moveEvtName, e => {
      if (!device && !isMouseDown) {
        return false
      }
      const docEle = document.documentElement
      if (!this.clientRect) {
        this.clientRect = {
          left: 0,
          top:0
        }
      }
      const x = (device ? e.touches[0].clientX : e.clientX) -
      this.clientRect.left + docEle.scrollLeft - docEle.clientLeft
      const y = (device ? e.touches[0].clientY : e.clientY) -
      this.clientRect.top + docEle.scrollTop - docEle.clientTop 
      this.drawPoint(x, y)
    }, false)
  }

  drawLottery = () => {
    this.background = this.background || this.createElement('canvas', {
      style: 'position:absolute;left:0;top:0;'
    })
    this.mask = this.mask || this.createElement('canvas', {
      style: 'position:absolute;left:0;top:0;'
    })
    this.background.className = 'canvas'
    this.mask.className = 'canvas'
    if (!this.conNode.innerHTML.replace(/[\w\W]| /g, '')) {
      this.conNode.appendChild(this.background)
      this.conNode.appendChild(this.mask)
      this.clientRect = this.conNode ? this.conNode.getBoundingClientRect() : null
      this.bindEvent()
    }

    this.backCtx = this.backCtx || this.background.getContext('2d')
    this.maskCtx = this.maskCtx || this.mask.getContext('2d')

    if (this.lotteryType === 'image') {
      const image = new Image()
      image.onload = () => {
        this.width = this.width
        this.height = this.height
        this.resizeCanvas(this.background, this.width, this.height)
        this.backCtx.drawImage(this, 0, 0)
        this.drawMask()
      }
      image.src = this.lottery
    } else if (this.lotteryType === 'text') {
      this.drawMask()
      setTimeout(() => {
        this.width = this.width
        this.height = this.height
        this.resizeCanvas(this.background, this.width, this.height)
        this.backCtx.save()
        this.backCtx.fillStyle = '#fff9ea'
        this.backCtx.fillRect(0, 0, this.width, this.height)
        this.backCtx.restore()
        this.backCtx.save()
        var fontSize = 12
        this.backCtx.font = 'Bold ' + fontSize + 'px PingFangSC-Medium'
        this.backCtx.textAlign = 'center'
        this.backCtx.fillStyle = '#A87F57'
        this.backCtx.fillText(`兑换码：`, this.width / 2, this.height / 2 + fontSize / 2 - 25)
        this.backCtx.fillText(this.lottery, this.width / 2, this.height / 2 + fontSize / 2)
        this.backCtx.restore()
        // this.drawMask()
      }, 100)
      
    }
  }

  drawMask = () => {
    this.resizeCanvas(this.mask, this.width, this.height)
    if (this.coverType === 'color') {
      this.maskCtx.fillStyle = this.cover
      this.maskCtx.fillRect(0, 0, this.width, this.height)
      this.maskCtx.globalCompositeOperation = 'destination-out'
    } else if (this.coverType === 'image') {
      const image = new Image()
      image.setAttribute('crossOrigin', 'anonymous')
      const wid = this.width
      image.onload = () => {
        const {width, height} = image
        const left = (width - wid) / 2
        const top = height / 4.7
        this.maskCtx.drawImage(image, 0, 0, width, height, -left, -top, width, height)
        this.maskCtx.globalCompositeOperation = 'destination-out'
      }
      image.src = this.cover
    }
  }
}
