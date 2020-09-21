import React from 'react'
import propTypes from 'prop-types'
import { connect } from 'react-redux'
import { Toast, Picker, DatePicker } from 'antd-mobile'
import { API, fun, ua } from '@src/common/app'
import { mapDispatchToProps, mapStateToProps } from '@/store/actions/user'
import { Page, Bomb } from '@src/components'
import wxconfig from '@src/common/utils/wxconfig'
import {
  trackPointToolHeightMeasurePageView,
  trackPointToolHeightPageBtnClick
} from '../buried-point'
import infoMaleNo from '@/assets/images/height/info_male_no.png'
import infoMale from '@/assets/images/height/info_male.png'
import infoFemaleNo from '@/assets/images/height/info_female_no.png'
import infoFemale from '@/assets/images/height/info_female.png'
import tip from '@/assets/images/height/icon_tips.png'
import height from '@/assets/images/height/icon_height.png'
import weight from '@/assets/images/height/icon_weight.png'
import cake from '@/assets/images/height/icon_cake.png'
import measureBomb from '@/assets/images/height/measure_bomb.png'
import closeIcon from '@/assets/images/height/icon_close.png'
import rightIcon from '@/assets/images/height/icon_right.png'

import styles from './input.scss'

const { setSetssion, getParams, fmtDate, getSetssion } = fun
const { isAndall, isIos } = ua
class HeightInput extends React.Component {
  state = {
    sex: '', // female,male
    date: new Date(Date.now()),
    dateValue: '',
    multiArray: [],
    multiIndex: [],
    multiWeightArray: [],
    multiWeightIndex: [],
    bomb: {
      measureBomb: false
    }
  }
  componentDidMount () {
    const { hasReport, linkManId } = getParams()
    let params = {}
    params = linkManId ? { linkManId: +linkManId } : {}
    API.getLastInput(params).then(({ data }) => {
      const { birthday, height, sex, weight } = data
      this.setState({
        sex: sex || '',
        multiIndex: height ? height.split('.') : [],
        multiWeightIndex: weight ? weight.split('.') : [],
        begin: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365 * 18 - 1000 * 60 * 60 * 24 * 4),
        multiArray: [this.createArr(30, 300), this.createArr(0, 9)],
        multiWeightArray: [this.createArr(1, 300), this.createArr(0, 9)],
        hasReport,
        date: new Date(birthday || Date.now()),
        dateValue: birthday || ''
      })
    })
    this.wxShare(getSetssion('shareInfo'))
    let version = 'wechat_h5'
    if (isAndall()) {
      if (isIos()) {
        version = 'app_ios'
      } else {
        version = 'app_android'
      }
    }
    trackPointToolHeightMeasurePageView({ os_version: version })
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
  // 选择性别
  changeSex = (sexValue) => {
    const { sex } = this.state
    if (sex === sexValue) return
    this.setState({
      sex: sexValue
    })
  }
  handleChangeValue = (type, value) => {
    if (type === 'height') {
      this.setState({
        multiIndex: value
      })
    } else if (type === 'weight') {
      this.setState({
        multiWeightIndex: value
      })
    } else if (type === 'cake') {
      this.setState({
        date: value,
        dateValue: fmtDate(value, '/')
      })
    }
  }
  // 选择性别
  handleSetSex = () => {
    const { sex } = this.state
    if (sex === '') {
      return <div className={styles.sexBox}>
        <img onClick={() => this.changeSex('male')} className={styles.img} src={infoMaleNo} />
        <img onClick={() => this.changeSex('female')} className={styles.img} src={infoFemaleNo} />
      </div>
    }
    if (sex === 'male') {
      return <div className={styles.sexBox}>
        <img onClick={() => this.changeSex('male')} className={styles.img} src={infoMale} />
        <img onClick={() => this.changeSex('female')} className={styles.img} src={infoFemaleNo} />
      </div>
    }
    if (sex === 'female') {
      return <div className={styles.sexBox}>
        <img onClick={() => this.changeSex('male')} className={styles.img} src={infoMaleNo} />
        <img onClick={() => this.changeSex('female')} className={styles.img} src={infoFemale} />
      </div>
    }
  }
  // 输入开始和结束的值，返回数组
  createArr = (a, b) => {
    var arr = []
    let obj = {
      label: '',
      value: ''
    }
    for (var i = a; i <= b; i++) {
      obj = {
        label: '' + i,
        value: '' + i
      }
      arr.push(obj)
    }
    return arr
  }
  handleGoToNext = () => {
    const { sex, dateValue, multiIndex, multiWeightIndex, hasReport } = this.state
    const { linkManId } = getParams()
    if (!sex) return Toast.info('请选择性别！')
    if (!multiIndex.length) return Toast.info('请选择身高！')
    if (!multiWeightIndex.length) return Toast.info('请选择体重！')
    if (!dateValue) return Toast.info('请选择生日！')
    let version = 'wechat_h5'
    if (isAndall()) {
      if (isIos()) {
        version = 'app_ios'
      } else {
        version = 'app_android'
      }
    }
    trackPointToolHeightPageBtnClick({ Btn_name: 'measure_to_compare', os_version: version })
    Toast.loading('加载中...')
    const params = {
      birthday: dateValue,
      height: multiIndex.join('.'),
      linkManId: +linkManId,
      sex,
      weight: multiWeightIndex.join('.')
    }
    const { history } = this.props
    API.caculateHeight(params).then(res => {
      const { data } = res
      if (data) {
        setSetssion('heightInfo', data)
        hasReport === 'true' ? history.push('/contrast-height') : history.push('/nodata')
      }
    })
  }
  handleShowBomb = (type, value) => {
    const { bomb } = this.state
    if (type === 'measureBomb') {
      this.setState({
        bomb: {
          ...bomb,
          measureBomb: value
        }
      })
    } else if (type === 'heightBomb') {
      this.setState({
        bomb: {
          ...bomb,
          heightBomb: value
        }
      })
    }
  }
  render () {
    const { multiArray, multiIndex, multiWeightArray, multiWeightIndex, date, dateValue, begin, bomb } = this.state
    const btns = [{
      name: '取消',
      event: () => this.handleShowBomb('heightBomb', false),
      color: '#88889D'
    }, {
      name: '确认',
      event: () => this.handleShowBomb('heightBomb', false),
      color: '#88889D'
    }]
    const bodyCont = `你输入的身高比上一次低`
    return (
      <Page title='儿童身高潜力测评'>
        <div className={styles.inputCont}>
          <div className={styles.sexTitle}>性别</div>
          {this.handleSetSex()}
          <div
            className={styles.tipBox}
            onClick={() => this.handleShowBomb('measureBomb', true)}
          >
            如何正确测量婴幼儿的身高
            <img className={styles.rightIcon} src={rightIcon} alt='' />
          </div>
          <div className={styles.inputsBox}>
            <div className={styles.height}>
              <div className={styles.left}>
                <img className={styles.img} src={height} />
                <span className={styles.text}>身高</span>
              </div>
              <Picker
                title='身高'
                data={multiArray}
                cascade={false}
                value={multiIndex}
                onOk={(e) => this.handleChangeValue('height', e)}
              >
                <span
                  className={multiIndex.length > 0 ? styles.num : styles.placeholder}
                >
                  {
                    multiIndex.length > 0
                      ? `${multiIndex.join('.')}cm`
                      : '点击输入身高'
                  }
                </span>
              </Picker>
            </div>
            <div className={styles.weight}>
              <div className={styles.left}>
                <img className={styles.img} src={weight} />
                <span className={styles.text}>体重</span>
              </div>
              <Picker
                title='体重'
                data={multiWeightArray}
                cascade={false}
                value={multiWeightIndex}
                onOk={(e) => this.handleChangeValue('weight', e)}
              >
                <span
                  className={multiWeightIndex.length > 0 ? styles.num : styles.placeholder}
                >
                  {
                    multiWeightIndex.length > 0
                      ? `${multiWeightIndex.join('.')}kg`
                      : '点击输入体重'
                  }
                </span>
              </Picker>
            </div>
            <div className={styles.cake}>
              <div className={styles.left}>
                <img className={styles.img} src={cake} />
                <span className={styles.text}>生日</span>
              </div>
              <DatePicker
                mode='date'
                title='选择日期'
                minDate={begin}
                maxDate={new Date()}
                value={date}
                onOk={(e) => this.handleChangeValue('cake', e)}
              >
                <span
                  className={dateValue.length > 0 ? styles.num : styles.placeholder}
                >
                  {
                    dateValue.length > 0
                      ? dateValue
                      : '点击输入生日'
                  }
                </span>
              </DatePicker>
            </div>
          </div>
          <div className={styles.btnBox}>
            <span className={styles.btn} onClick={this.handleGoToNext}>点击查看测评报告</span>
            <div className={styles.detailText}>
              <img className={styles.img} src={tip} />
              建议每隔6个月重新自测一次，以持续了解身高发育进展。
            </div>
          </div>
          {
            bomb.measureBomb
              ? <div className={styles.bombCont}>
                <div className={styles.bomb}>
                  <div className={styles.close}>
                    <img
                      className={styles.closeIcon}
                      src={closeIcon}
                      alt=''
                      onClick={() => this.handleShowBomb('measureBomb', false)} />
                  </div>
                  <p className={styles.bombTitle}>正确测量的建议</p>
                  <img className={styles.measureBomb} src={measureBomb} alt='' />
                  <p className={styles.bombDesc}>
                    1. 请尽量脱去孩子的鞋子、帽子、厚衣物<br />
                    2. 平躺着，请尽量不要穿纸尿裤<br />
                    3. 请尽量保持双腿伸直<br />
                    4. 每次测量请尽量使用同一个测量工具<br />
                    5. 每次测量请尽量在一天的同一个时间段
                  </p>
                </div>
              </div>
              : ''
          }
          {
            bomb.heightBomb
              ? <Bomb
                bodyCont={bodyCont}
                footers={btns}
              />
              : null
          }
        </div>
      </Page>
    )
  }
}
HeightInput.propTypes = {
  history: propTypes.object,
}
export default connect(mapStateToProps, mapDispatchToProps)(HeightInput)
