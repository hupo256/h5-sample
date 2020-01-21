import React, { Component } from 'react'
import propTypes from 'prop-types'
import styles from '../skinBeauty.scss'
import close from '@static/skinBeauty/close.png'
import choose from '@static/skinBeauty/choose.png'
import closeTip from '@static/skinBeauty/closeTip.png'
class ShowModal extends Component {
  static propTypes = {
    persons:propTypes.array,
    visible: propTypes.bool,
    handleToggle: propTypes.func,
    linkManId:propTypes.number,
    type:propTypes.number
  }
  state = {
    showFlag:false,
    linkManId:this.props.linkManId,
    tips:[
      {
        n1:'80%~100%',
        n2:'较高',
        n3:'建议试用'
      },
      {
        n1:'60%~79%',
        n2:'中等',
        n3:'考虑试用'
      },
      {
        n1:'40%~59%',
        n2:'较低',
        n3:'谨慎选择'
      },
      {
        n1:'0%~39%',
        n2:'极低',
        n3:'慎重选择'
      }
    ]
  }
  componentDidMount () {
  }
  chooseThis=(i, id) => {
    console.log(i, id)
    this.setState({ linkManId:id })
  }

  render () {
    const { tips, linkManId } = this.state
    const { persons, visible, handleToggle, type } = this.props
    return visible ? (
      <div>
        <div className={styles.mask} onClick={handleToggle} />
        {
          type === 1
            ? <div className={styles.person}>
              <p className={styles.title}>
                <span>切换检测人</span>
                <img src={close} onClick={handleToggle} />
              </p>
              <div className={styles.name}>
                {
                  persons.map((item, index) => (
                    <p key={index} onClick={() => this.chooseThis(index, item.id)}>
                      <span>{`${item.userName}(${item.relationName})`}</span>
                      {
                        item.id === linkManId ? <img src={choose} /> : ''
                      }

                    </p>
                  ))
                }
              </div>
            </div>
            : type === 2
              ? <div className={styles.tips}>
                <p><img src={closeTip} onClick={handleToggle} /></p>
                <p className={styles.name}>匹配说明</p>
                <p className={styles.des}>表示该成分/产品和你的基因检测结果以及目前肌肤状态的匹配程度</p>
                <p className={styles.title}>
                  <span>匹配度范围</span>
                  <span>匹配度</span>
                  <span>使用建议</span>
                </p>
                <div>
                  {
                    tips.map((item, i) => (
                      <p key={i} className={styles.text}>
                        <span>{item.n1}</span>
                        <span>{item.n2}</span>
                        <span>{item.n3}</span>
                      </p>
                    ))
                  }
                </div>
                <p className={styles.det}>
                产品和成分的推荐依据是美妆成分和您基因检测结果以及肌肤状态的匹配性。但由于不同的护肤品处理工艺的差别，可能会造成实际效果的不同。
                </p>
              </div>
              : type === 3
                ? <div className={styles.tips2}>
                  <p><img src={closeTip} onClick={handleToggle} /></p>
                  <p className={styles.name}>免责声明</p>
                  <p className={styles.des}>
                  安我上的所有商品/服务的标题、价格、详情等信息内容系来源于商品/服务的经营者，其真实性、准确性和合法性均由商品/服务的经营者负责。
                  安我提醒用户购买商品/服务前注意谨慎核实。
                  </p>
                  <p className={styles.btn} onClick={handleToggle}>我知道了</p>
                </div>
                : null
        }

      </div>
    ) : ''
  }
}
export default ShowModal
