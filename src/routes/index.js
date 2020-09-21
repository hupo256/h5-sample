import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import sensors from '@src/common/utils/sensors'
import fun from '@src/common/utils'
import Router from './router'

// import Home from './mkt/xinguan' // 示例页
// import Yinyang from './yinyang' // 营养小工具
// import SkinSearch from './skinSearch' // 美肤小工具
// import Mkt from './mkt' // 市场活动
// import AnReports from './anReports'// 安小软报告
// import Binding from './binding'// 采样器
// import News from './detail' // 新闻
// import Height from './height' // 身高小工具
// import UnlockLand from './unlockLand' // 299活动
// import Orders from './orders' // 订单
// import Login from './login' //登录
// import report from './report' // 报告相关
// import Platform365 from './platform365' // 报告相关
// import Integration from './integration' // 积分
// import OneKeyUnlock from './one-key-unlock'
// import Sampling from './sampling'
// import Meadjohnson from './meadjohnson';
// import hpv from './hpv' // 报告相关
// import Healthy from './healthy' // 健康档案
// import GiftPacks from './giftPacks' // 大礼包
// import HealthRecords from './healthRecords' // 健康档案
// import GiftPacks from './giftPacks' // 大礼包
// import Members from './members' // 报告相关
// import Institute from './institute' // 报告相关
// import Questionnaire from './questionnaire' // 表型问卷
import SelfTools from './selfTools' // 表型问卷

const routes = () => (
  <BrowserRouter basename='/mkt/'>
    <Switch>
      <Route path='/' component={({ match }) => {
        sensors.quick('autoTrackSinglePage') // 神策埋点服务
        fun.togetPageIds() // 页面id服务
        return (
          <Router>
            <React.Fragment>
              {/* <Route exact path='/xingg' render={() => <Home />} /> */}
              {/* <Route exact path='/meadjohnson' render={() => <Meadjohnson />} /> */}
              {/* {Yinyang} */}
              {/* {OneKeyUnlock} */}
              {/* {Binding} */}
              {/* {News} */}
              {/* {Height} */}
              {/* {Login} */}
              {/* {SkinSearch} */}
              {/* {UnlockLand} */}
              {/* {report} */}
              {/* {Platform365} */}
              {/*  {GiftPacks} */}
              {/* {Mkt} */}
              {/* {hpv} */}
              {/* {Sampling} */}
              {/* {Orders} */}
              {/* {Healthy} */}
              {/* {HealthRecords} */}
              {/* {GiftPacks} */}
              {/* {Mkt} */}
              {/* {Integration} */}
              {/* {Members} */}
              {/* {Institute} */}
              {/* {Questionnaire} */}
              {/* {Expert} */}
              {SelfTools}
            </React.Fragment>
          </Router>
        )
      }} />
    </Switch>
  </BrowserRouter>
)

export default routes
