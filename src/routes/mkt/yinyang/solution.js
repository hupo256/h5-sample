import React from 'react'
import { observer, inject } from 'mobx-react'
import { Page } from '@src/components'
import images from '@src/common/utils/images'
import { fun } from '@src/common/app'
import {YYGJpageview, YYGJsolutiondetailexpertsgoto} from './componets/BuriedPoint'
import LinkMans from './componets/linkMans'
import PlanDetails from './componets/planDetails'
import BannerBox from './componets/bannerBox'
import styles from './yinyang'
const { getParams } = fun
const { yinyang } = images

@inject('yinyang')
@observer
class Solution extends React.Component {
  state = {
    tabIndex: 0,
  }

  componentDidMount () {
    const { linkManId, dimensionCode, geneTags } = getParams()
    const { yinyang: { getNutrilonToolsSolution } } = this.props
    getNutrilonToolsSolution({linkManId, dimensionCode, geneTags}).then(res => {
      document.body.scrollTop = 1
      document.documentElement.scrollTop = 1
    })

    YYGJpageview({view_type: 'detail'})
  }

  tabClick = (num) => {
    this.setState({
      tabIndex: num
    })
  }

  gotoExpertsPoint = () => {
    YYGJsolutiondetailexpertsgoto()
  }

  render () {
    const { yinyang: { data:{solutiondata} } } = this.props
    const {dataInfo, ageStr, imageType, userName, modelName } = solutiondata
    let subPlan, detPlan, bannerData, sMan
    if(dataInfo && dataInfo.length > 0) {
      dataInfo.slice().forEach((item) => {
        switch (item.moduleType) {
          case 1701:
            subPlan = item.data
            return
          case 1801:
            detPlan = item.data.tabContentDtos || []
            return
          case 1101:
            bannerData = item.data
            return
          }
      });

      sMan = {ageStr, imageType, userName} 
    }
    return (
      <Page title={modelName || '解决方案'}>
        <React.Fragment>
        <div className={styles.yinyang}>
          <LinkMans isSolution={true} sMan={sMan} />
          {/* <LinkMans isSolution={true}/> */}

          {/* subPlan  */}
          {subPlan && <div className={`${styles.subSolu}`}>
            <p dangerouslySetInnerHTML={{ __html: subPlan.content || '' }} />
            <img src={`${yinyang}planbg.png`} />
          </div>}

          {/* PlanDetails */}
          {detPlan && detPlan.length> 0 && <PlanDetails {...this.props}/>}

          {/* banner */}
          {bannerData && bannerData.productList && bannerData.productList.length > 0 &&
            <BannerBox banList={bannerData.productList} viewType='detail' />
          }

          <a className={styles.getCall} href="tel:400-682-2288" onClick={this.gotoExpertsPoint}>
            <img src={`${yinyang}phone.png`} />问问专家
          </a>
        </div>
        </React.Fragment>
      </Page>
    )
  }
}

export default Solution
