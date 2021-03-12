import React from 'react'
import { Page } from '@src/components'
import styles from '../login'
import loginOneKey from '@static/loginImages/onekey.png'
import loginUnChoose from '@static/loginImages/unChoose.png'
import loginWechatLogin from '@static/loginImages/wechat.png'
class OneKeyLogin extends React.Component {
  state = {

  }
  componentDidMount() {
    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = 'https://jverification.jiguang.cn/scripts/jverification-web.min.js';
    document.head.appendChild(script);
    script.onload = () =>{
      this.initJVerificationInterface();
    }
  }

  initJVerificationInterface = () =>{
    window.JVerificationInterface.init({
      appkey: "145aa067946628cff8804c65", // 极光官网中创建应用后分配的 appkey，必填
      debugMode: true,// 设置是否开启 debug 模式。true 则会打印更多的日志信息。设置 false 则只会输出 w、e 级别的日志
      fail: function(data) {

      }, success: function(data) {
        window.JVerificationInterface.getToken({
          operater:"CM",//可填 移动：CM，联通：CU，电信：CT
            fail: function(data)  {
            //alert("JVerificationInterface getToken fail:"+JSON.stringify(data))
          }, success: function(data)  {
            var token = data.content;
            //alert("JVerificationInterface getToken success:"+token)
          }
        })
      }
    })
  }

  render() {

    return (
      <Page title='绑定手机号'>
        <div>
            <div className={styles.oneKeyImg}>
                <img src={`${loginOneKey}`}></img>
            </div>
            <div className={styles.phoneNum}>188****1192</div>
            <div className={styles.oneKeyBtn}>一键绑定</div>
            <div className={styles.agreeWrap}>
                <div className={styles.agreeBtn}>
                    <img src={`${loginUnChoose}`} />
                </div>
                <div className={styles.agreeDes}>
                我已阅读并同意<span>《个人隐私条款》</span><span>《用户购买协议》</span><span>《中国移动认证服务条款》</span>，并使用本机号码登录
                </div>
            </div>
            <div className={styles.otherLogin}>
              <div className={styles.otherLine}></div>
              <div className={styles.otherLine}></div>
              <div>其他手机号登录</div>
            </div>
            <div className={styles.wechatWrap}>
                <img src={`${loginWechatLogin}`} />
                微信登录
            </div>
            <div className={styles.serverDes}>中国移动为您提供本机号码认证服务</div>
        </div>
      </Page>
    )
  }
}

export default OneKeyLogin
