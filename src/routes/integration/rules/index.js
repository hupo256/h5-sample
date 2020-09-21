import React from 'react'
import { Page } from '@src/components'
import { MyLoader } from '@src/components/contentLoader'
import integrationApi from '@src/common/api/integrationApi'
import styles from './rules'

class Rules extends React.Component {
  state = {
    loading:false,
    rules:{},
    taskRules:[],
  }
  componentDidMount () {
    this.getPointRuleInfo()
  }
  getPointRuleInfo=() => {
    integrationApi.getPointRuleInfo({ noloading:1 }).then(({ data }) => {
      if (data) {
        console.log(data)
        this.setState({
          rules:data,
          taskRules:data.taskRules
        })
      }
    })
  }
  goBack=() => {
    this.props.history.goBack()
  }
  render () {
    const { loading, rules, taskRules } = this.state
    return (
      <Page title='安我积分规则'>
        {
          loading
            ? <MyLoader />
            : <div className={`${styles.rules}`}>
              <div className={styles.padding20}>
                <div className={styles.introduction}>
                  <p className={styles.title}>积分简介及适用范围</p>
                  <div className={styles.desc}>
                    <p>1.安我积分仅可在「安我生活」APP中获取和使用，如用户账号暂停使用，则安我将取消该用户账号内安我积分相关使用权益。</p>
                    <p>2.安我积分可直接用于支付订单时使用，{rules.exchangeTip}</p>
                    <p>3.您可在“我的-我的积分”中查询到积分的详细情况。</p>
                  </div>
                </div>
                <div className={styles.introduction}>
                  <p className={styles.title}>积分获取规则</p>
                  <div className={styles.desc}>
                    <p>1.以下表格仅展示部分积分获取方式，还可以通过参与“每日问答”或不定期活动获取。具体请密切关注安我生活</p>
                  </div>
                  <div className={styles.tips}>
                    <div className={styles.column}>
                      <span>任务</span>
                      <span>积分</span>
                      <span>备注</span>
                    </div>
                    <div>
                      {
                        taskRules.map((item, i) => (
                          <p key={i} className={styles.text}>
                            <span>{item.taskName}</span>
                            <span>{item.taskPoint}</span>
                            <span>{item.remark}</span>
                          </p>
                        ))
                      }
                    </div>
                  </div>
                  <div className={styles.desc}>
                    <p>2.购物/解锁商品回馈积分注意事项</p>
                    <p>&nbsp;&nbsp;(1)用户必须是在「安我生活」APP上购买基因检测类商品才可获得积分，第三方平台如天猫，京东等不享受积分回馈。</p>
                    <p>&nbsp;&nbsp;(2)解锁和支付均可回馈积分，实际支付1元可累积1积分，商品实付金额是指用户实际以现金/银行卡等方式支付的商品金额。（以公司转账和邮局汇款的方式支付不回馈积分）</p>
                    <p>&nbsp;&nbsp;(3)订单完成是指：订单已显示完成且报告已出，用户未办理退货手续。若发生取消订单，则购买/解锁获取的积分将相应扣除；</p>
                  </div>
                </div>
                <div className={styles.introduction}>
                  <p className={styles.title}>积分使用规则</p>
                  <div className={styles.desc}>
                    <p>1.下单时使用，{rules.exchangeTip}，每单最多用积分抵扣订单金额的{rules.orderDeductRate}</p>
                    <p>2.每单实付金额大于等于{rules.orderDeductMinAmount}元，才可使用积分抵扣。</p>
                    <p>3.如果拥有的安我积分小于{rules.orderUsePointMinPoint}，则不可在结算页或收银台使用</p>
                    <p>4.一旦使用后，安我积分将不予退还。</p>
                    <p>5.更多积分使用方式敬请期待。</p>
                  </div>
                </div>
                <div className={styles.introduction}>
                  <p className={styles.title}>积分兑好礼规则</p>
                  <div className={styles.desc}>
                    <p>1.「安我生活」APP端“积分兑好礼”中的商品均可使用积分或积分加现金的形式兑换，积分在兑换成功后原则上不予退回。</p>
                    <p>2.兑换订单生成后请尽快完成支付，30分钟后未付款订单将自动关闭。</p>
                    <p>3.部分商品每天仅可兑换一次。</p>
                    <p>4.所有兑换商品由安我生活统一发放，兑换后请耐心等待。</p>
                  </div>
                </div>
                <div className={styles.introduction}>
                  <p className={styles.title}>有效期说明</p>
                  <div className={styles.desc}>
                    <p>1.用户获得但未使用的安我积分，将在这一个自然年底过期，安我将定期对过期积分进行作废处理。例2020年12月31日将清空2020年度客户获得但未使用的积分。</p>
                    <p>2.使用积分支付的商品发生退货时，若积分退回时已过有效期，则直接进行作废处理，不再返还。</p>
                  </div>
                </div>
                <div className={styles.introduction}>
                  <p className={styles.title}>温馨提示</p>
                  <div className={styles.desc}>
                    <p>获得安我积分后，用户可自行选择积分使用方式，但其应遵守如下行为规范：</p>
                    <p>1.须通过正常途径获得安我积分，不得通过软件、外挂等方式获取；</p>
                    <p>2.须维护良好的安我积分秩序，不得影响安我积分的正常运营；</p>
                    <p>3.在获取和使用安我积分的过程中，如果出现违规行为（如作弊领取、虚假交易等，安我将取消您的获取资格，并有权撤销违规交易，扣除违规获得或使用的安我积分,必要时追究法律责任。）</p>
                    <p>4.安我积分仅限本人使用，不得兑现，不可转让。</p>
                    <p>5.详情可咨询安我基因，客服电话: 4006822288</p>
                  </div>
                </div>
              </div>
            </div>
        }
      </Page>
    )
  }
}

export default Rules
