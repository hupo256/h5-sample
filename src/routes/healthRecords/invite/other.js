import React from 'react'
import Page from '@src/components/page'
import styles from './invite.scss'
import { ua, fun } from '@src/common/app'
import { Toast } from 'antd-mobile'
const { fixScroll, getParams } = fun
const { isIos } = ua

class Other extends React.Component {
  state = {
    otherName:localStorage.otherName,
  }

  componentDidMount () {
  }
  submitBtn=() => {
    let obj = getParams()
    if (!this.state.otherName) {
      Toast.info('您必须输入关系名称后才能提交')
      return
    }
    localStorage.setItem('relationshipId', 23)
    localStorage.setItem('otherName', this.state.otherName)
    if (obj.pageType === 'edit') {
      this.props.history.push(`/healthRecords/invite/info?pageType=${obj.pageType}&linkManId=${obj.linkManId}&otherUserId=${obj.otherUserId}&type=${obj.type}&flag=1`)
    } else {
      this.props.history.push(`/healthRecords/invite/info?flag=1&acceptToken=${obj.acceptToken}&jwt=${obj.jwt}`)
    }
  }
  render () {
    return (
      <Page title='完善亲友信息'>
        <div className={styles.integration} id='top'>
          {
            <div className={styles.info}>
              <label>关系</label>
              <input
                maxLength='6'
                placeholder='请输入关系'
                onBlur={() => {
                  isIos() && window.scrollBy(0, fixScroll().top)
                }}
                value={this.state.otherName}
                onChange={e => { this.setState({ otherName: e.target.value }) }} />
            </div>
          }
          <div className={styles.submitBtn} onClick={this.submitBtn}>
            <p>提交</p>
          </div>
        </div>
      </Page>
    )
  }
}

export default Other
