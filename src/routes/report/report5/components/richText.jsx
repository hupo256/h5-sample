import React, { Component } from 'react'
import down_icon from '@static/down_icon.png'
import styles from '../style.scss'
import Bar from './barChart.jsx'
import { ua } from '@src/common/app'

class RichCard extends Component {
  static propTypes = {

  }
  state = {
    boolArr: [false]
  }
  componentDidMount() {

  }

  goZhongan = (des) => {
    let andallUrl = des.split('href="')[1].split('" target=')[0]
    let h5Url = des.split('url=')[1].split('" target=')[0]
    h5Url = h5Url.replace(/&amp;/g, '&')
    if (ua.isAndall()) {
      alert(h5Url)
      andall.invoke('openUrl', { url:h5Url })
    } else {
      window.location.href = h5Url
    }
  }
  changeBoolArr = (index) => {
    const { boolArr } = this.state
    const arr = boolArr.slice()
    if (index + 1 > boolArr.length) {
      arr[index] = true
    } else {
      arr[index] = !arr[index]
    }
    console.log(arr)
    this.setState({
      boolArr: arr
    })
  }
  render() {
    const { data, username, isAuthority } = this.props
    const { boolArr } = this.state
    if (isAuthority === 2) { // 授权给他人看的报告不可点击
      if (document.getElementsByTagName('a').length) {
        for (let i = 0; i <= document.getElementsByTagName('a').length; i++) {
          if (document.getElementsByTagName('a')[i]) {
            document.getElementsByTagName('a')[i].removeAttribute('onclick', '')
            document.getElementsByTagName('a')[i].href = 'javascript:;'
          }
        }
      }
    }

    if (data.description && data.description.indexOf('p.zhongan.com') > 0) {
      data.description = data.description.replace('<a', '<span style="color:#6567E5"')
      data.description = data.description.replace('</a', '</span')
      console.log(data.description)
    }
    let show, twoLevel, showline = false
    if (!!data.twoLevelContentDtos && !!data.twoLevelContentDtos[0] && !!data.twoLevelContentDtos[0].description) {
      twoLevel = true
    }
    if (!!data.description || !!data.text || !!data.itemList || twoLevel) {
      show = true
    }
    if (!!data.description || !!data.text || !!data.itemList) {
      showline = true
    }
    return (show
      ? <div className={styles.card}>
        <div className={styles.richText}>
          <div>
            <img src={data.moduleIconUrl} alt='' />
            <div>{data.title && data.title.replace(/\$name/g, username)}</div>
          </div>
          <div style={(twoLevel && !showline) ? { visibility: 'hidden' } : null} />
          {data.description && <div
            onClick={() => (data.description && data.description.indexOf('p.zhongan.com') > 0) ? this.goZhongan(data.description) : null}
            className={styles.normalText}
            dangerouslySetInnerHTML={{ __html: data.description && data.description.replace(/\$name/g, username) }} />}

          {data.text && <div className={styles.normalText}
            dangerouslySetInnerHTML={{ __html: data.text && data.text.replace(/\$name/g, username) }} />}

          {data.itemList && <div className={styles.normalText}>
            <h2 style={{ padding: '10px 0 22px' }}>{data.subTitle}</h2>
            <Bar list={data.itemList} />
          </div>}
          {twoLevel && data.twoLevelContentDtos.map((item, index) => {
            if (item.description == '') {
              return null
            }
            return (
              <div className={styles.drawer} key={index}>
                <div />
                <div onClick={() => this.changeBoolArr(index)}>
                  <div>
                    <img src={item.moduleIconUrl} alt='' />
                    <div>{item.title && item.title.replace(/\$name/g, username)}</div>
                  </div>
                  <img
                    className={boolArr[index] ? styles.arrowRotate : null}
                    src={down_icon} alt='' />
                </div>
                <div
                  style={boolArr[index] ? null : { height: '0', padding: '0' }}
                  dangerouslySetInnerHTML={{ __html: item.description && item.description.replace(/\$name/g, username) }} />
              </div>)
          })
          }
        </div>
      </div> : null
    )
  }
}

export default RichCard
