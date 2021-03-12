import React from 'react'
import { observer, inject } from 'mobx-react'
import Page from '@src/components/page'
import LinkMans from './componets/linkMans'
import DefaultStatus from './componets/defaultStatus'
import SiweiBox from './componets/siweiBox'
import ResDetails from './componets/resDetails'
import RecomList from './componets/recomList.jsx'
import BannerBox from './componets/bannerBox'
import AllergyBox from './componets/allergyBox'
import { MyLoader } from '../lego/MyLoader';

import styles from './yinyang'

@inject('yinyang')
@observer
class YinYang extends React.Component {
  state = {
    sharePop: false,
  }

  componentDidMount () {
    const { yinyang: { getNutrilonToolsIndex } } = this.props
    getNutrilonToolsIndex().then(res => {
      document.body.scrollTop = 1
      document.documentElement.scrollTop = 1
    })
  }

  render () {
    const { yinyang: { data:{indexdata, loading, noscroll} } } = this.props
    const { dataInfo, curLinkManId, newUserPageFlag=1, qnaireUrl, geneTags } = indexdata
    let siweiData,resData, allergyData, recomData, bannerData
    if(dataInfo && dataInfo.slice().length > 0) {
      dataInfo.slice().forEach((item) => {
        switch (item.moduleType) {
          case 1301:
            siweiData = item.data
            return
          case 1401:
            resData = item.data
            return
          case 1501:
            allergyData = item.data
            return
          case 1601:
            recomData = item.data
            return
          case 1101:
            bannerData = item.data
            return
          }
      });
    }

    return (
      <Page title='宝宝专属营养方案'>
        {loading ? <MyLoader /> : 
        <div className={ `${noscroll ? styles.noscroll : ''} ${styles.yinyang}`}>
        {(newUserPageFlag || (dataInfo && dataInfo.slice().length  === 0)) ? 
          <DefaultStatus curLinkManId={curLinkManId} qnaireUrl={qnaireUrl} {...this.props} /> : 
          <React.Fragment>
            <LinkMans />

            {/* 四维图 */}
            {siweiData && <SiweiBox siweiData={siweiData} />}

            {/* 测评结果 */}     
            {resData && <ResDetails resData={resData} curLinkManId={curLinkManId} geneTags={geneTags} {...this.props} />}
            
            {/* 过敏 */}
            {allergyData && <AllergyBox allergyData={allergyData} curLinkManId={curLinkManId} geneTags={geneTags}{...this.props} />}
            
            {/* 推荐 */}
            {recomData && <RecomList recomData={recomData}/>}

            {/* banner */}
            {bannerData && bannerData.productList && bannerData.productList.length > 0 &&
              <BannerBox banList={bannerData.productList} viewType='result' />
            }
          </React.Fragment>
        }
        </div>}
      </Page>
    )
  }
}

export default YinYang
