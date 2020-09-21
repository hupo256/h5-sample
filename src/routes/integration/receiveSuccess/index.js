import React from 'react'
import Page from '@src/components/page'
import MyLoader from '@src/components/contentLoader'
import styles from '../receive/receive'
import images from '../images'

class ReceiveSuccess extends React.Component {
  state = {
    loading:false,
    receiveList:[],
    orderAddress: {},
    phoneNum: false,
  }

  componentDidMount () {
  }
  goLottery=() => {
    this.props.history.push('/integration/lottery')
  }
  render () {
    const { loading } = this.state
    return (
      <Page title='领取成功'>
        {
          loading
            ? <MyLoader />
            : <div className={styles.success}>
              <img src={images.success} />
              <p>领取成功</p>
              <p>奖品将在7个工作日内发货哦，请耐心等待</p>
              <div className={styles.more} onClick={this.goLottery}>
                更多奖品
              </div>
              <div className={styles.service} >
                <a href='tel:400-682-2288'>
                  <img src={images.service} />
                  <span>联系客服</span>
                  <img src={images.serviceRight} />
                </a>
              </div>
            </div>
        }
      </Page>
    )
  }
}

export default ReceiveSuccess
