import React from 'react'
import propTypes from 'prop-types'
import { fun, API, ua } from '@src/common/app'
import { DatePicker } from 'antd-mobile'
import wxconfig from '@src/common/utils/wxconfig'
import { Page } from '@src/components'
import styles from './addrecord'
import addBg from '@static/height/add_bg.png'
import edit from '@static/height/icon_edit.png'
import triangleLeft from '@static/height/icon_triangle_left.png'
import head from '@static/height/icon_head.png'
import body from '@static/height/icon_body.png'
import triangleDown from '@static/height/icon_triangle_down.png'
import {
  trackPointToolHeightInputRecordPageView
} from '../buried-point'
const { getSession, fmtDate, getParams } = fun
class UserInfo extends React.Component {
  state = {
    weight: [],
    weightStyle: {
      width: 0
    },
    activedWeight: 1.6,
    date: new Date(Date.now()),
    begin: null,
    dateFlag: false,
    height: [],
    heightStyle: {
      heightCont: 0,
      maxHeight: 150,
      minHeight: 56,
      height: 56
    },
    activedHeight: 50,
    heightArr: [48, 200],
    weightArr: [0, 150]
  }
  componentDidMount () {
    let { linkManId } = getParams()
    const currentLinkManInfo = getSession('currentLinkManInfo')
    linkManId = +linkManId || +currentLinkManInfo.linkManId || null
    trackPointToolHeightInputRecordPageView({
      sample_linkmanid: linkManId
    })
    const { heightArr, weightArr } = this.state
    this.handleSetChizi(weightArr, 'weight')
    this.handleSetChizi(heightArr, 'height')
    const lineHeight = document.getElementById('heightCont').offsetHeight - document.getElementById('babyHeight').offsetHeight
    const { measureDate } = getParams()
    let begin = new Date(Date.now() - 1000 * 60 * 60 * 24 * 365 * 18 - 1000 * 60 * 60 * 24 * 4)
    if (new Date(currentLinkManInfo.birthday) > new Date(Date.now() - 1000 * 60 * 60 * 24 * 365 * 18 - 1000 * 60 * 60 * 24 * 4)) {
      begin = new Date(currentLinkManInfo.birthday)
    }
    this.setState({
      theBaseHeight :lineHeight,
      date: measureDate ? new Date(measureDate) : new Date(),
      begin
    })
    if (!ua.isAndall()) {
      this.wxShare(getSession('shareInfo'))
    }
  }
  /**
   * 微信分享
   */
  wxShare = (shareInfo) => {
    const { title, jumpUrl, subTitle, headImg } = shareInfo
    wxconfig({
      showMenu: true,
      params:{
        title,
        link: jumpUrl,
        desc: subTitle,
        imgUrl: headImg,
      }
    })
  }
  addEventListenerSroll = () => {
    let fixedDom = document.getElementById('scroll1')
    let box1Dom = document.getElementById('box1')
    fixedDom.addEventListener('scroll', () => this.handleWidth(fixedDom.scrollLeft, box1Dom.offsetLeft - fixedDom.offsetLeft))
  }
  addEventListenerSrollHeight = () => {
    let fixedDom = document.getElementById('scroll2')
    let box1Dom = document.getElementById('box2')
    fixedDom.addEventListener('scroll', () => this.handleHeight(fixedDom.scrollTop, box1Dom.offsetTop - fixedDom.offsetTop))
  }
  handleHeight = (top1, top2) => {
    const { heightArr, theBaseHeight } = this.state
    const lineHeight = document.getElementById('heightCont').offsetHeight - document.getElementById('babyHeight').offsetHeight
    const { height, heightStyle } = this.state
    const newLine = (heightArr[0] * 10 + 16) - (theBaseHeight - lineHeight) / 10
    const activedHeight1 = (top1 / (top2 / (height.length - 1) / 10) + newLine) / 10
    const height1 = top1 / (top2 / (+heightStyle.maxHeight - +heightStyle.minHeight)) + 50
    this.setState({
      heightStyle: {
        ...heightStyle,
        height: height1
      },
      activedHeight: Math.round(activedHeight1 * 10) / 10
    })
  }
  handleWidth = (left1, left2) => {
    const { weightArr, weight } = this.state
    const activedWeight = (left1 / (left2 / (weight.length - 1) / 10) + weightArr[0] * 10 + 16) / 10
    this.setState({
      activedWeight: Math.round(activedWeight * 10) / 10
    })
  }
  handleSetChizi = (arr, type) => {
    const { heightArr, weightArr, heightStyle } = this.state
    let newArr = []
    for (let i = arr[0]; i <= arr[1]; i++) {
      newArr.push(i)
    }
    let weightWidth = ((newArr.length - 1) * 10 + 1) * 0.27 + 'rem'
    if (type === 'weight') {
      this.setState({
        weight: newArr,
        weightStyle: {
          width: weightWidth
        },
        activedWeight: weightArr[0] + 1.6
      }, () => {
        // this.handleSetWeight()
        this.addEventListenerSroll()
      })
    } else {
      this.setState({
        height: newArr,
        heightStyle: {
          ...heightStyle,
          heightCont: weightWidth
        },
        activedHeight: heightArr[0] + 1.6
      }, () => {
        // this.handleSetHeight()
        this.addEventListenerSrollHeight()
      })
    }
  }
  handleSetWeight = () => {
    const { weight } = getParams()
    const { activedWeight, weightArr } = this.state
    if (weight) {
      if (+weight === +activedWeight) return
      const scroll1 = document.getElementById('scroll1')
      scroll1.scrollLeft = (+weight - weightArr[0] - 1.6) * 10 * 10
    }
  }
  handleSetHeight = () => {
    const Height = getParams().height
    const { activedHeight, heightArr, theBaseHeight, heightStyle, height } = this.state
    // console.log(theBaseHeight, lineHeight)
    if (Height) {
      if (+Height === +activedHeight) return
      const scroll2 = document.getElementById('scroll2')

      // top1 / (top2 / (height.length - 1) / 10) + newLine = 80 * 10
      // console.log((+Height * 10 - 71) * 10 * (height.length - 1) * )

      // const chizhiHeight = document.getElementById('chizhiHeight')
      const height22 = (height.length - 1) * (Height - heightArr[0] + 16) * 10 / (+heightStyle.maxHeight - +heightStyle.minHeight)
      // console.log(height22)
      scroll2.scrollTop = (+Height - heightArr[0] - 1.6 + height22) * 10 * 10
    }
  }
  handleEditDate = () => {
    this.setState({
      dateFlag: true
    })
  }
  handleChangeValue = (value) => {
    this.setState({
      date: value,
      dateFlag: false
    })
  }
  handleNext = () => {
    let { linkManId, birthday, sex, linkManName, weight, measureDate, id } = getParams()
    const { activedWeight, activedHeight, date } = this.state
    const currentLinkManInfo = getSession('currentLinkManInfo')
    linkManId = +linkManId || +currentLinkManInfo.linkManId || null
    linkManName = linkManName ? decodeURIComponent(linkManName) : currentLinkManInfo.linkManName
    birthday = birthday || currentLinkManInfo.birthday
    sex = sex || currentLinkManInfo.sex
    let params = {}
    let fun = ''
    if (measureDate) {
      fun = API.editHeightInputRecords
      params = {
        id: +id,
        height: activedHeight + '',
        measureDate: fmtDate(date),
        weight: activedWeight + ''
      }
    } else {
      fun = API.recordHeightInput
      params = {
        linkManName,
        linkManId,
        birthday,
        sex,
        height: activedHeight + '',
        measureDate: fmtDate(date),
        type: 1,
        weight: activedWeight + ''
      }
    }
    fun(params).then(({ code }) => {
      if (!code) {
        if (weight) {
          this.props.history.push(`/height/height-index?linkmanId=${linkManId}`)
        } else {
          this.props.history.push(`/height/height-index?linkmanId=${linkManId}&brithday=${birthday}&measureDate=${fmtDate(date)}`)
        }
      }
    })
  }
  render () {
    const { weight, weightStyle, activedWeight, date, begin, dateFlag, height, heightStyle, activedHeight } = this.state
    return (
      <Page title='记录身高数据'>
        <div className={styles.infoCont} style={{
          background: `url(${addBg}) no-repeat rgba(246,246,240,1)`,
          backgroundSize: '100%'
        }}>
          <div className={styles.data} onClick={this.handleEditDate}>
            {fmtDate(date, '/')}
            <img className={styles.edit} src={edit} alt='' />
          </div>
          <div className={styles.heightCont} id='heightCont'>
            <p className={styles.title}>身高</p>
            <div className={styles.heightDetailCont}>
              <p className={styles.activedHeight}>{activedHeight}cm</p>
              <div id='babyHeight' className={styles.babyHeight}>
                <p className={styles.line} />
                <span className={styles.triangleLeft}>
                  <img src={triangleLeft} alt='' />
                </span>
                <div className={styles.head}>
                  <img src={head} alt='' />
                </div>
                <div className={styles.body}>
                  <img
                    src={body}
                    style={{
                      height: heightStyle.height,
                      minHeight: heightStyle.minHeight,
                      maxHeight: heightStyle.maxHeight,
                    }}
                    alt=''
                  />
                </div>
              </div>
            </div>
            <div className={styles.overHidden} id='scroll2'>
              {/* <div className={styles.maskTop1} />
              <div className={styles.maskTop2} /> */}
              <div className={styles.chizi} style={{ height: heightStyle.heightCont }} id='chizhiHeight' >
                {
                  height && height.length
                    ? height.map((item, index) => {
                      if (!(index === height.length - 1)) {
                        return (<span key={index}>
                          <span className={styles.num}>{item}</span>
                          <span className={styles.long} />
                          <span className={styles.short} />
                          <span className={styles.short} />
                          <span className={styles.short} />
                          <span className={styles.short} />
                          <span className={styles.long} />
                          <span className={styles.short} />
                          <span className={styles.short} />
                          <span className={styles.short} />
                          <span className={styles.short} />
                        </span>)
                      } else {
                        return (<span key={index}>
                          <span className={styles.num}>{item}</span>
                          <span className={`${styles.long} ${styles.last}`}
                            id='box2' />
                        </span>)
                      }
                    })
                    : ''
                }
              </div>
            </div>
          </div>
          <div className={styles.weightCont}>
            <p className={styles.title}>体重</p>
            <span className={styles.triangleDown}>
              <img src={triangleDown} alt='' />
            </span>
            <div className={styles.overHidden} id='scroll1'>
              <div className={styles.chizi} style={{ width: weightStyle.width }} >
                {
                  weight && weight.length
                    ? weight.map((item, index) => {
                      if (!(index === weight.length - 1)) {
                        return (<span key={index}>
                          <span className={styles.num}>{item}</span>
                          <span className={styles.long} />
                          <span className={styles.short} />
                          <span className={styles.short} />
                          <span className={styles.short} />
                          <span className={styles.short} />
                          <span className={styles.long} />
                          <span className={styles.short} />
                          <span className={styles.short} />
                          <span className={styles.short} />
                          <span className={styles.short} />
                        </span>)
                      } else {
                        return (<span key={index}>
                          <span className={styles.num}>{item}</span>
                          <span className={`${styles.long} ${styles.last}`}
                            id='box1' />
                        </span>)
                      }
                    })
                    : ''
                }
              </div>
            </div>
            <div className={styles.activedWeight}>{activedWeight}kg</div>
            <span className={styles.line} />
          </div>
          <span className={styles.btn} onClick={this.handleNext}>提交</span>
          <DatePicker
            mode='date'
            title='选择日期'
            minDate={begin}
            maxDate={new Date()}
            value={date}
            visible={dateFlag}
            onOk={(e) => this.handleChangeValue(e)}
            onDismiss={() => this.setState({ dateFlag: false })}
          />
        </div>
      </Page>
    )
  }
}
UserInfo.propTypes = {
  history: propTypes.object,
}
export default UserInfo
