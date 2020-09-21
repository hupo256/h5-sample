import React from 'react'
import Page from '@src/components/page'
import styles from './my.scss'
import { ua, fun } from '@src/common/app'
import healthRecordsApi from '@src/common/api/healthRecordsApi'
const { fixScroll, getParams } = fun
const { isIos } = ua
class Other extends React.Component {
  state = {
    pageType:+getParams().type,
    myInfo:JSON.parse(localStorage.myInfo),
    height:JSON.parse(localStorage.myInfo).height,
    weight:JSON.parse(localStorage.myInfo).weight
  }
  submitBtn=() => {
    let { myInfo, height, weight } = this.state
    healthRecordsApi.updateLinkManInfo({
      id:getParams().id,
      height,
      weight,
      userName:myInfo.userName,
      birthday:myInfo.birthday
    }).then(res => {
      if (res) {
        console.log(res.data)
        this.props.history.push(`/healthRecords/myInfo?id=${getParams().id}`)
      }
    })
  }
  render () {
    let { height, weight, pageType } = this.state
    return (
      <Page title='个人资料'>
        <div className={styles.myInfo} id='top'>
          {
            <div className={styles.info}>
              <label>{pageType === 1 ? '身高(cm)' : '体重(kg)'}</label>
              <input
                type='number'
                onBlur={() => {
                  isIos() && window.scrollBy(0, fixScroll().top)
                }}
                value={pageType === 1 ? height : weight}
                onChange={e => { pageType === 1 ? this.setState({ height: e.target.value }) : this.setState({ weight: e.target.value }) }} />
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
