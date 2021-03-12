import React from 'react'
import Page from '@src/components/page'
import styles from '../binding'
export default class AboutUs extends React.Component {
  render() {
    return (
      <Page title='关于安我'>
        <div className={styles.protocol}>
          <div className={styles.protocolBox}>
            <h2>【产品简介】</h2>
            <p>“安我生活”作为“美好生活连接者”的生活方式服务平台，通过基因检测的产品与服务，为用户提供全新的健康管理理念和科学生活的服务工具。精准解决用户在不同人生阶段的N+1个健康场景需求，为新妈妈、新女性、新家庭提供定制化解决方案，达成“生活因我安好”的品牌承诺。您可以在本APP中完成：</p>
            <p>- 购买基因检测产品</p>
            <p>- 查看基因检测报告</p>
            <p>- 享受免费专家咨询及专属解决方案</p>
            <p>- 阅读与分享有趣的基因知识</p><br />
            <p>更多检测项目持续更新中，敬请期待。</p><br />
            <h2>【如何在家做检测】</h2>
            <p>- 在线下单购买</p>
            <p>- 在家中完成唾液采集</p>
            <p>- 在“安我生活”中绑定采样器</p>
            <p>- 在“安我生活”预约顺丰快递，免费回寄检测样本</p>
            <p>- 在“安我生活”上查看基因检测报告（实验室收到有效样本后，大约2周左右出报告）</p><br />
            <h2>【联系我们】</h2>
            <p>如果你想了解更多安我产品与服务信息，或者有任何意见和建议欢迎联系我们。</p>
            <p>官方网站：www.andall.com</p>
            <p>微信公众号：安我AndAll（ID：andallgene）</p>
            <p>邮箱地址：enquiry@andall.com</p>
            <p>客服电话：400-682-2288</p>
          </div>
        </div>
      </Page>
    )
  }
}
