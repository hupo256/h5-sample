import React from 'react'
import images from './images'
import { observer, inject } from 'mobx-react'
import { ua } from '@src/common/app'
import { YYGJsharegoto, YYGJchangerolegoto, YYGJZJbannergoto } from './BuriedPoint'
import toDoShare from '@src/common/utils/toDoShare'
import styles from '../yinyang'

@inject('yinyang')
@observer
class LinkMans extends React.Component {
  state = {
    showList: false,
    sharePop: false,
    isAndall: ua.isAndall(),
  }

  componentDidMount () {
    toDoShare(this.touchShareParas())
  }

  touchShareParas = () => {
    return {
      shareUrl: window.location.origin + '/mkt/yinyang',
      title: "你家宝宝营养达标了吗？这里帮你找答案",
      subTitle: "打好营养基础，让宝宝成长快人一步",
      headImg: `${origin}/mkt/yinyang/images/shareHeader.png`,
    }
  }

  touchTheViewType = () => {
    const solution = window.location.href.indexOf('solution')
    const { noRes } = this.props
    let viewType = ''
    if(solution){
      viewType = 'detail'
    } else {
      viewType = noRes ? 'landingpage' : 'result'
    }
    return viewType
  }

  toShare = () => {
    YYGJsharegoto({view_type: this.touchTheViewType()})
    const {isAndall} = this.state
    console.log(isAndall)
    if (!isAndall) {
      this.setState({sharePop: true})
      return
    }
    toDoShare(this.touchShareParas(), isAndall)
  }

  toggleMask = (key, boolean) => {
    if(boolean) return
    this.setState({
      [key]: !this.state[key]
    })
  }

  getTheMan = (id) => {
    const { yinyang: { data:{ indexdata:{linkManInfoModels}} } } = this.props
    return linkManInfoModels && linkManInfoModels.slice().filter(man => man.id === id)[0]
  }

  switchTheMan = (id) => {
    const pointPara = {
      view_type: this.touchTheViewType(),
      linkman_id: id
    }
    YYGJchangerolegoto(pointPara)

    const { yinyang: { getNutrilonToolsIndex, swichLinkManId } } = this.props
    getNutrilonToolsIndex(id)
    swichLinkManId(id)
  }

  render () {
    const { showList, sharePop } = this.state
    const { yinyang: { data:{ indexdata:{linkManInfoModels, curLinkManId}} }, noRes, isSolution, sMan } = this.props
    const banShareIcon = noRes ? images.toshareIcon : images.toshareIcon1
    const manList = linkManInfoModels ? linkManInfoModels.slice() : []
    let theMan = curLinkManId && this.getTheMan(curLinkManId)
    if(sMan) theMan = sMan
    
    return (
      <React.Fragment>
        <div className={styles.linkManbox}>
          {(curLinkManId || theMan)&& <React.Fragment>
            <img className={styles.manIcon} src={images[`manicon${theMan.imageType}`]} />
            <div 
              className={styles.namebox} 
              onClick={() => this.toggleMask('showList', isSolution)}
            >
              <b className={`${isSolution ? styles.solutionMan : ''}`}>{theMan.userName}</b>
              <span>{theMan.ageStr}</span>
            </div>
          </React.Fragment>}

          <img 
            className={styles.toshareInapp}
            onClick={() => this.toShare()} 
            src={banShareIcon} 
          />
        </div>

        {showList && <div className={styles.bottomMask}>
          <div className={styles.manListOut}>
            <div className={styles.titMans}>
              <span>切换检测人</span>  
              <img src={images.closeMask} onClick={() => this.toggleMask('showList')} />
            </div>
            { manList.length > 0 && <ul>
              {manList.map((item, index) => {
                const {id, imageType, userName} = item
                const cur = id === curLinkManId
                return <li key={index} onClick={() => this.switchTheMan(id)}>
                  <img src={images[`manicon${imageType}`]} />
                  <i>{`${userName} (宝宝)`}</i>
                  {cur && <img className={styles.selected} src={images.selected} />}
                </li>
              })}
            </ul>}
          </div>
        </div>}

        {sharePop && <div className={styles.sharebox} onClick={() => this.toggleMask('sharePop')}>
          <img src={images.nfriend_share} alt="nfriend_share"/>
        </div>}
      </React.Fragment>
    )
  }
}

export default LinkMans
