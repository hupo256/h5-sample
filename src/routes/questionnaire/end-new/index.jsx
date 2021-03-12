import React from 'react'
import Page from '@src/components/page'
import fun from '@src/common/utils'
import ua from '@src/common/utils/ua'
import questionnaireApi from '@src/common/api/questionnaireApi'
import styles from '../questionnaire'
import andall from '@src/common/utils/andall-sdk'
import Points from '@src/components/points/index'
import { qnaireCompletePageView, qnaireCompletePageGoto, } from '../BuriedPoint'
import qsend from '@static/qend_bg.png'

const { getSetssion, getParams } = fun
const yinyangPage = window.location.origin + '/mkt/yinyang'
const integrationPage = window.location.origin + '/mkt/integration/home?closeWebViewFlag=1'

export default class QuestionEnd extends React.PureComponent {
  constructor() {
    super()
    this.state = {
      toolsType: getSetssion('toolsType'),
      writeChannel: +getSetssion('writeChannel'),
      rewrite: getSetssion('rewrite'),
      qnaireId: getSetssion('qnaireId'),
      recommend: {},
      doneInfor:{},
    }
  }

  componentDidMount() {
    this.state.writeChannel && andall.invoke('closeWebViewFlag', {})
    const { isNewFlag } = getParams()
    if(+isNewFlag === 0) return
    this.getRecommend()
    this.getDoneInfor()
  }

  getDoneInfor = () => {
    const { writeChannel, qnaireId=3163091865273344 } = this.state
    if(+writeChannel === 2) return
    questionnaireApi.getQnaireJumpInfo({qnaireId}).then(res => {
      console.log(res)
      const { code, data } = res
      if (code) return
      this.setState({
        doneInfor: data
      })
    })
  }

  // 获取推荐信息
  getRecommend = () => {
    const { writeChannel } = this.state
    if(+writeChannel !== 2) return
    const { linkManId, qnaireCode='' } = getParams()
    const { productCode = '' } = getSetssion('recommend') || {}
    const params = {
      linkManId,
      productCode,
    }
    questionnaireApi.getRecommendInfo(params).then(res => {
      const { code, data } = res
      if (code) return
      this.setState({
        recommend: data
      })

      const recommend = this.touchBtnType(data.productType)
      const pointCofing = {
        sample_linkmanid: linkManId,
        qnaire_code: qnaireCode,
        recommend
      }
      qnaireCompletePageView(pointCofing)
    })
  }

  touchBtnType = (number) => {
    const num = +number
    let tex = ''
    if (!num) {
      tex = 'none'
    } else if (num === 2 || num === 5) {
      tex = 'unlock'
    } else {
      tex = 'test'
    }
    return tex
  }

  isInArray = (arr, val) => {
    let testStr = ',' + arr.join(',') + ','
    return testStr.indexOf(',' + val + ',') !== -1 // true 在，不可以/false 不在，可
  }
  handleBack = (url) => {
    const { toolsType, writeChannel } = this.state
    const code = getSetssion('questionnaireCode')
    if (writeChannel) {
      qnaireCompletePageGoto({ Btn_name:  'complete'})
      url || andall.invoke('back')
      url && window.location.replace(url)
      return
    }
    if (toolsType && toolsType === '20') {
      alert(toolsType)
      let arr = ['HTSPORT999', 'HTSPORT36', 'HTSPORT6', 'HTSLEEP999', 'HTSLEEP36', 'HTSLEEP6', 'HTNUTRION999', 'HTNUTRION36', 'HTNUTRION6']
      if (this.isInArray(arr, code)) {
        const heightPage = window.location.origin + '/mkt/height/height-index'
        window.location.href = heightPage
      } else {
        window.location.href = yinyangPage
      }
    } else if (+writeChannel === 1) {
      window.location.href = integrationPage
    } else {
      ua.isAndall() && andall.invoke('back')
    }
  }

  toBuy = (productId, productType) => {
    const Btn_name = this.touchBtnType(productType)
    qnaireCompletePageGoto({ Btn_name })
    setTimeout(() => {
      console.log(productId, productType)
      console.log(`andall://andall.com/product_detail?productId=${productId}&newProductDetailType=${productType}`)
      window.location.href = `andall://andall.com/product_detail?productId=${productId}&newProductDetailType=${productType}`
    },200)
  }

  render() {
    const { writeChannel, recommend, rewrite, doneInfor } = this.state
    const { headImg, prodTitle, traitTcDesc, price, productId, productType, btnTex } = recommend
    const { btnDocs='', btnUrl='', docs=''} = doneInfor
    // const htm = `<h3>与我相关脑筋的事</h3><p>与我相关的场景：培养孩子的才艺潜能是一件伤脑筋的事</p>`

    return (
      <Page title='表型问卷'>
        <div className={styles.questionEndNew}>
          <img src={qsend} alt='' />
          {docs ? 
            <div className={styles.doneTit} dangerouslySetInnerHTML={{__html: docs}}></div> :  
            <div className={styles.doneTit}><h3>问卷已完成</h3></div>
          }

          {!!(getSetssion('pointValue') && writeChannel && writeChannel !== 3 && !rewrite) &&
             <div className={styles.points}>
              <Points value={+getSetssion('pointValue')} />
            </div>
          }

          <span className={styles.btn} onClick={() => this.handleBack(btnUrl)}>{btnDocs || '完成'}</span>

          {prodTitle && <div className={styles.recBox}>
            <h3>为您推荐以下检测产品</h3>
            <div className={styles.proBox}>
              <img src={headImg} />
              <div className={styles.titbox}>
                <h3>{prodTitle}</h3>
                <p>{traitTcDesc}</p>
                <div className={styles.priceBox}>
                  <span>{price}</span>
                  <button onClick={() => this.toBuy(productId, productType)}>{btnTex}</button>
                </div>
              </div>
            </div>
          </div>}
        </div>
      </Page>
    )
  }
}