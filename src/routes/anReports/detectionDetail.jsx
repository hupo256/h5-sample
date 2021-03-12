import React, { Component } from 'react'
import Page from '@src/components/page'
import styles from './newDetails/detail'
import CardTitle from './components/cardTitle'
import ShowOrHide from './components//showOrHide'
import reportApi from '@src/common/api/reportApi'
import { fun } from '@src/common/app'
const { getParams } = fun

class detectionDetail extends Component {
  state = {
    detailList:[],
  }

  componentDidMount () {
    document.body.scrollIntoView()
    reportApi.getIntestinalDetail({
      barCode:getParams().barCode,
      shareToken:getParams().shareToken ? getParams().shareToken : ''
    }).then(res => {
      const { code } = res
      if (!code) {
        this.setState({ detailList:res.data.dataInfo.filter(item => item.moduleType === 4504)[0].data.bacterialDetailsDto.genusDetailsListDtos })
      }
    })
  }

  render () {
    const { detailList } = this.state
    return (
      <Page title={'菌群检测详情'}>
        <div className={styles.detectionDetail}>
          {
            detailList.map((item, index) => (
              <div key={index}>
                <CardTitle title={item.title} />
                <div className={styles.desc}>{item.description}</div>
                {
                  <ShowOrHide type={3} data={item.genusDetailsDtos} />
                }
              </div>
            ))
          }
          <div />
        </div>
      </Page>
    )
  }
}

export default detectionDetail
