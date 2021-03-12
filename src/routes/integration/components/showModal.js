import React, { Component } from 'react'
import propTypes from 'prop-types'
import styles from '../integration.scss'
import images from '../images'
import { ua } from '@src/common/app'
import ClipboardJS from 'clipboard'
import { Toast } from 'antd-mobile'
const { isIos } = ua

class ShowModal extends Component {
  static propTypes = {
    handleToggle: propTypes.func,
    goBuy:propTypes.func,
    type: propTypes.number,
    name:propTypes.string,
    goTry:propTypes.func,
    goOk:propTypes.func,
    goBinding:propTypes.func,
    prizeObj:propTypes.object,
    otherName:propTypes.string,
    iconUrl:propTypes.string,
    goOne:propTypes.func,
    goTogether:propTypes.func,
    goHave:propTypes.func,
    rulesInfo:propTypes.object,
    editInfo:propTypes.func,
    confirmInfo:propTypes.func,
    saveImg:propTypes.func,
    insufficientDesc:propTypes.string,
    details:propTypes.object,
    goConfirm:propTypes.func,
    doSomething:propTypes.func,
  }
  componentDidMount () {
    if (document.getElementById('box')) {
      // console.log(document.getElementById('box').offsetHeight + '=====')
      document.getElementById('box').style.marginTop = -1 * (document.getElementById('box').offsetHeight / 2) + 'px'
    }
  }
  handleCopyTxt=() => {
    setTimeout(() => {
      let clipboard = null
      clipboard = new ClipboardJS(`.copyBtn`)
      clipboard.on('success', e => {
        Toast.info('复制成功!', 1)
        e.clearSelection()
      })
      clipboard.on('error', e => {
        Toast.info('请手动长按复制', 1)
      })
    }, 200)
  }
  render () {
    const { type, name, handleToggle, goBuy, goTry, goOk, goHave, goBinding, prizeObj, otherName, iconUrl, goOne,
      goTogether, rulesInfo, editInfo, confirmInfo, saveImg, insufficientDesc, details, goConfirm, doSomething } = this.props
    return (
      <div className={styles.mask} >
        {
          type === 1
            ? <div className={styles.tips} id='box'>
              <img src={images.close} onClick={handleToggle} className={styles.close} />
              <p className={styles.name}>{name === 'recharge' ? '如何使用？' : '活动规则说明'}</p>
              <p className={styles.desc}>
                { name === 'recharge' ? '1.在确认订单页勾选“余额”，即可使用对应金额' : ' 1.在「解锁」页或「购买」页选择商品，并点击“去下单”'}
              </p>
              <img src={`${name === 'recharge' ? images.recharge3 : images.exchange1}`} className={`${name === 'recharge' ? styles.recharge3 : styles.img2}`} />
              <p className={styles.desc}>
                { name === 'recharge' ? '2.点击页面底部“确认购买”按钮即可下单支付' : ' 2.在「确认订单」页勾选积分，即可抵扣对应金额'}
              </p>
              <img src={`${name === 'recharge' ? images.recharge4 : images.exchange2}`} className={`${name === 'recharge' ? styles.recharge4 : styles.img2}`} />
              {name !== 'recharge' && <p className={`${styles.desc}`}>3.点击页面底部“去支付”按钮即可下单支付</p>}
            </div>
            : type === 10
              ? <div className={styles.tipsLong} id='box'>
                <img src={images.close} onClick={handleToggle} className={styles.close} />
                <div className={styles.name}>活动规则</div>
                {
                  isIos() ? <div style={{ textAlign:'center', color:'#38395b' }}>（该抽奖活动与苹果公司无关）</div> : ''
                }
                <div className={styles.scrollBox}>
                  <p>一 活动玩法</p>
                  <p>1.用户可通过「安我生活」APP参与抽奖活动。每人每天有一次免费抽奖机会。免费机会用完后，每次参与抽奖活动将消耗{rulesInfo.onceConsume}个安我积分，积分一旦消耗，不支持退回。</p>
                  <p>2.每个用户每天最多参与抽奖{rulesInfo.awardCount}次。</p>
                  <p>二 活动奖品</p>
                  <p>1.优惠券奖励：以当日显示的优惠券为准。</p>
                  <p>用户可在APP-我的-优惠券内查看获得的优惠券和使用时间</p>
                  <p>2.积分奖励：以当日显示的积分为准。</p>
                  <p>用户可在APP-我的-积分-积分明细中查看抽中积分的记录</p>
                  <p>3.实物奖励：以当日显示的奖品为准。</p>
                  <p>用户可在APP-积分-积分抽奖-我的奖品中查看抽中的奖品，并在{rulesInfo.expireDays}日的有效期内及时领取，收货信息需提供中国大陆地区地址及手机号；</p>
                  <p>逾期未领取则视为放弃，概不以其他形式补偿；</p>
                  <p>实物奖品将在领取后7个工作日内完成寄出，请耐心等待。</p>
                  <p>4.活动奖品的具体使用规则以届时该奖品的详情说明为准；</p>
                  <p>5.所有中奖奖品不可兑换现金、不可退换；</p>
                  <p>6.奖品的优惠券、积分，不可转让他人使用，不能兑换现金；</p>
                  <p>三、注意事项</p>
                  <p>1.任何人通过不正当手段（包括但不限于侵犯第三人合法权益、作弊、扰乱系统、实施网络攻击、批量注册、用机器注册账户、用机器模拟客户端等方式）获得本次活动权益的，「安我生活」APP有权撤销用户所获利益并要求赔偿相关损失。</p>
                  <p>2.「安我生活」APP可以根据本次活动的实际举办情况对活动规则变更或调整，相关变动或调整将公布在活动页面上，并于公布时生效。</p>
                  <p>3.如出现不可抗力或情势变更的情况（包括重大灾害事件/活动受政府机关指令需要停止举办或调整的/活动遭受严重网络攻击或因系统故障等）导致活动需要停止或调整的，我们有权终止活动而无需向用户进行赔偿或补偿。</p>
                  <p>4.更多详情，可咨询安我客服，联系电话021-80344674 。</p>
                </div>
              </div>
              : type === 11
                ? <div className={`${styles.noReport} ${styles.noLottie}`} id='box'>
                  <img src={images.noLottie} />
                  <p>很遗憾，您未中奖～</p>
                  <div className={styles.goTry} onClick={goTry}>再试一次</div>
                </div>
                : type === 12
                  ? <div className={styles.hasLottie}>
                    <div className={styles.coupon}>
                      <div className={styles.couponleft}>
                        <label>¥</label>
                        <span>{prizeObj.couponInfo.couponDiscountValue}</span>
                      </div>
                      <p className={styles.border} />
                      <div className={styles.couponright}>
                        {
                          prizeObj.couponInfo.couponLimitAmount
                            ? <p>{`满${prizeObj.couponInfo.couponLimitAmount}元可用`}</p>
                            : <p>无门槛券</p>
                        }
                        <p>{`有效期${prizeObj.couponInfo.couponValidDay}天`}</p>
                      </div>
                    </div>
                    <p className={styles.desc}>
                      <label>&nbsp;</label>
                      <span>{prizeObj.couponInfo.couponLimitDesc}</span>
                    </p>
                    <p className={styles.p1}>恭喜您，中奖了～</p>
                    <p className={styles.p2}>可至我的-优惠券中查看</p>
                    <div className={styles.goTry} onClick={goOk}>好的</div>
                  </div>
                  : type === 13
                    ? <div className={`${styles.noReport} ${styles.hasCoupon}`} id='box'>
                      <label className={styles.yourPoints}>{prizeObj.pointInfo.faceValue}</label>
                      <img src={images.hasPoints} />
                      <p>恭喜您，中奖了～</p>
                      <p>+{prizeObj.pointInfo.faceValue}积分</p>
                      <span>已发送至您的积分账户</span>
                      <div className={styles.goTry} onClick={goOk}>好的</div>
                    </div>
                    : type === 14
                      ? <div className={`${styles.noReport} ${styles.hasCoupon}`} id='box'>
                        <img src={prizeObj.goodsInfo.iconUrl} />
                        <p>恭喜您，中奖了～</p>
                        <p>{`价值${prizeObj.goodsInfo.faceValue}元的${prizeObj.goodsInfo.awardName}`}</p>
                        <span>可至安我抽奖-我的奖品中查看</span>
                        <div className={styles.goTry} onClick={goHave}>立即领取</div>
                      </div>
                      : type === 15
                        ? <div className={styles.noReport} id='box'>
                          <img src={iconUrl} />
                          <p>您还有其他奖品</p>
                          <p>{otherName}待领取～</p>
                          <div className={styles.cancelBtn} onClick={goOne}>不用了</div>
                          <div className={styles.goBuy} onClick={goTogether}>一起领</div>
                        </div>
                        : type === 20
                          ? <div className={styles.noReport} id='box'>
                            <p style={{ textAlign:'left' }}>请确认身高和体重数据属实，真实数据有利于我们提供更精准的定制化建议哦。</p>
                            <div className={styles.cancelBtn} onClick={editInfo}>返回修改</div>
                            <div className={styles.goBuy} onClick={confirmInfo}>确认提交</div>
                          </div>
                          : type === 5
                            ? <div className={`${styles.tips} ${styles.subscribeWechat}`} id='box'>
                              <h5>安我公众号</h5>
                              <img src={images.close} onClick={handleToggle} className={styles.close} />
                              <img src={images.wechat1} className={styles.wechat} id='wechat1' />
                              <div className={styles.goTry} onClick={saveImg}>保存二维码</div>
                              <p>1.保存二维码到手机，打开微信扫一扫</p>
                              <p>2.点击扫码界面右上方，从手机相册选择二维码图片</p>
                            </div>
                            : type === 6
                              ? <div className={`${styles.tips} ${styles.subscribeWechat}`} id='box'>
                                <img src={images.close} onClick={handleToggle} className={styles.close} />
                                <h5>安我小助理</h5>
                                <img src={images.wechat2} className={styles.wechat} id='wechat2' />
                                <div className={styles.goTry} onClick={saveImg}>保存二维码</div>
                                <p>1.保存二维码到手机，打开微信扫一扫</p>
                                <p>2.点击扫码界面右上方，从手机相册选择二维码图片</p>
                              </div>
                              : type === 7
                                ? <div className={`${styles.tips} ${styles.subscribeWechat}`} id='box'>
                                  <img src={images.close} onClick={handleToggle} className={styles.close} />
                                  <h5>如何互动评论？</h5>
                                  <div className={styles.text}>1.在抖音APP中搜索“<span id='copyText'>安我健康AndAll</span>”</div>
                                  <div className={styles.text}>2.选择某个视频进行评论，参与互动</div>
                                  <div className={styles.text}>3.重复评论同一视频不累计送积分哦</div>
                                  <div className={`${styles.goTry} copyBtn`} onClick={() => this.handleCopyTxt()} data-clipboard-target={`#copyText`}>复制抖音号</div>
                                </div>
                                : type === 8
                                  ? <div className={`${styles.tips} ${styles.subscribeWechat}`} id='box'>
                                    <img src={images.close} onClick={handleToggle} className={styles.close} />
                                    <h5>如何关注？</h5>
                                    <div className={styles.text}>1.在抖音APP中搜索“<span id='copyText'>安我健康AndAll</span>”</div>
                                    <img src={images.douyin2} className={styles.doImg} />
                                    <div className={styles.text}>2、点击关注按钮即可完成关注</div>
                                    <img src={images.douyin1} style={{ marginBottom:0 }} className={styles.doImg} />
                                    <div className={`${styles.goTry} copyBtn`} onClick={() => this.handleCopyTxt()} data-clipboard-target={`#copyText`}>复制抖音号</div>
                                  </div>
                                  : type === 21
                                    ? <div className={styles.noReport} id='box'>
                                      <p style={{ textAlign:'left' }}>{insufficientDesc}</p>
                                      <div className={styles.cancelBtn} onClick={handleToggle}>取消</div>
                                      <div className={styles.goBuy} onClick={doSomething}>赚积分</div>
                                    </div>
                                    : type === 22
                                      ? <div className={styles.noReport} id='box'>
                                        <p style={{ textAlign:'left' }}>
                                      你确认要用{details.point}积分
                                          {details.amount ? <span>+{details.amount}元</span> : ''}
                                      兑换“{details.name}”？
                                        </p>
                                        <div className={styles.cancelBtn} onClick={handleToggle}>取消</div>
                                        <div className={styles.goBuy} onClick={goConfirm}>
                                          {details.amount === 0 ? '确认' : '立即支付'}
                                        </div>
                                      </div>
                                      : type === 23
                                        ? <div className={styles.noReport} id='box'>
                                          <p>您确定要取消订单吗？</p>
                                          <div className={styles.cancelBtn} onClick={handleToggle}>取消</div>
                                          <div className={styles.goBuy} onClick={goConfirm}>确定</div>
                                        </div>
                                        : <div className={styles.noReport} id='box'>
                                          <img src={images.noReport} />
                                          <p>{type === 2 ? '您当前还没有报告哦～' : type === 3 ? '您当前没有绑定的采样器，不能进行解锁操作哦～'
                                            : type === 4 ? '您当前还没有可回寄的采样器～' : ''}</p>
                                          {
                                            <div className={styles.cancelBtn} onClick={handleToggle}>{type === 2 || type === 3 ? '取消' : '好的'}</div>
                                          }
                                          {
                                            type === 2 || type === 3 ? <div className={styles.goBuy} onClick={goBuy}>去购买</div>
                                              : type === 4 ? <div className={styles.goBuy} onClick={goBinding}>去绑定</div> : ''
                                          }
                                        </div>
        }
      </div>
    )
  }
}
export default ShowModal
