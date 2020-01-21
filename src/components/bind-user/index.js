import React from 'react'
import { DatePicker, Picker, Toast } from 'antd-mobile'
import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'
import { fun, ua, API, point } from '@src/common/app'
import { Page, WxUpload } from '@src/components'
import { filter } from '@src/common/app'

import styles from './binduser'

const { nationMap } = filter
const { fmtDate, getParams, fixScroll, getSetssion, formatAddres } = fun
const nowTimeStamp = Date.now()
const now = new Date(nowTimeStamp)
const { isIos } = ua
const { allPointTrack } = point
const AddresList = formatAddres()


@inject('user')
@observer
class BindUserNew extends React.Component {
  state = {
    birthday: null,
    relationId: '',
    addres: false,
    nation: false,
    listReation: {},
    sex: '',

    pickerPop: '',
    flag: false,
    expectDate: null,
  }
  // 埋点记录输入样本信息
  trackPointSampleBindInput (userInfo) {
    const barcode = getSetssion('barcode')
    let obj = {
      eventName: 'sample_bind_input',
      pointParams: {
        sample_barcode: barcode,
        sample_linkman: userInfo.id,
        sample_name: userInfo.userName.substr(0, 1) + '**',
        relationId: userInfo.relationId,
        sample_sex: userInfo.sex,
        sample_birthday: userInfo.birthday
      }
    }
    allPointTrack(obj)
  }

  componentDidMount () {
    this.getData()
    this.getMaxDate()
  }

  // 获取数据
  getData = () =>  {
    const {getParams}=this.props;
    const { id, linkManId } = getParams;

    if (id || linkManId) {
      API.selectById({ id: id || linkManId,noloading:1 }).then(res => {
        const { code, data } = res
        if (!code) {
          const { userName, birthday, relationId, sex, expectDate, flag } = data
          this.setState({
            bindUserName: userName,
            relationId: +relationId,
            sex,
            birthday: new Date(birthday),
            expectDate: expectDate && new Date(expectDate),
            flag,
          })
        }
      })
    } else {
      const barcode = getSetssion('barcode').barcode || getParams.barcode;
      API.getExpectDateInfo({ barCode: barcode,noloading:1 }).then(res => {
        const { code, data } = res
        const { flag, expectDate } = data
        if (!code) {
          this.setState({
            flag,
            expectDate: expectDate && new Date(expectDate)
          })
        }
      })
    }


  }

  // 绑定用户
  bindUser = () => {
    let { birthday, sex, bindUserName, relationId, addres, nation, expectDate } = this.state

    const {getParams}=this.props;
    const obj = getParams;


    const { history, user: {upLindManId} } = this.props
    let { id, linkManId, url, barcode, ids } = obj
    birthday = fmtDate(birthday)
    expectDate = fmtDate(expectDate)
    bindUserName && (bindUserName = bindUserName.replace(/(^\s*)|(\s*$)/g, ''))
    if (!relationId) {
      Toast.info('请选择关系')
      return
    }
    if (!bindUserName) {
      Toast.info('请填写姓名')
      return
    }
    if (!birthday) {
      Toast.info('请选择生日')
      return
    }
    if (!sex.length) {
      Toast.info('请选择性别')
      return
    }

    // if (!addres.length) {
    //   Toast.info('请选择户籍')
    //   return
    // }
    // if (!nation.length) {
    //   Toast.info('请选择民族')
    //   return
    // }
    let data = {
      birthday,
      // nation,
      // addres,
      expectDate,
      sex,
      relationId,
      id: id || linkManId,
      userName: bindUserName
    }
    let getData = null
    if (linkManId) {
      data = {
        ...data,
        barcode: barcode || getSetssion('barcode').barcode || '',
      }
      getData = API.userupdate
    } else if (barcode || id) {
      data = {
        ...data,
        barCode: barcode,
        operateType: id ? 1 : 0,
      }
      getData = API.updateBindLinkMan
    } else {
      const { barcode } = getSetssion('barcode')
      data = {
        ...data,
        barcode: barcode,
      }
      getData = API.listAdd
    }
    /***
     * 来源id 为采样器、报告列表过来编辑
     * linkManId 有url为报告列表过来绑定关系,否则为列表选择过来没有关系id
     * barcode 为采样器列表过来，更换新增逻辑
     * 没有参数为正常新增
     */
    getData(data).then(res => {
      const { code } = res

      if (!code) {
        const { userName, ...params } = data
        let query = {
          linkManId: data.id,
          userName: data.userName
        }
        if (barcode || id) {
          if (barcode) {
            const { userName } = res.data || {}
            API.confirmGender({ barCode: barcode }).then(response => {
              Toast.success(id ? '操作成功' : `已为您切换成${userName}`, 1.5, () => {
                if (url && ids) {
                  url += `?linkManId=${res.data.id}`
                }
                upLindManId({ userName, linkManId: res.data.id })
                id ? history.push(url || '/')
                  : this.saveLastUserLindManId({ userName, linkManId: res.data.id }, url || '/')
              })
            })
            return
          }

          Toast.success('操作成功', 1.5, () => {
            if (url && ids) {
              url += `?linkManId=${ids}`
            }
            upLindManId({ userName, linkManId: res.data.id })
            history.push(url || '/')
          })
          return
        }
        if (linkManId) {
          const jumitUrl = url ? `${url}?linkManId=${linkManId}` : '/select-user'
          this.saveLastUserLindManId(query, jumitUrl)
          return
        }
        this.trackPointSampleBindInput(data)
        history.push({
          pathname: '/protocol',
          state: {
            ...params,
            linkManId: res.data.id,
            bindUserName: userName
          }
        })
      }
    })
  }

  hadnleToast = () => {

    const {getParams}=this.props;
    const { linkManId } = getParams;

    if (linkManId) {
      Toast.info('无法修改', 1)
    }
  }

  /**
   * 保存切换关系人linkManId
   */
  saveLastUserLindManId = (obj = {}, url) => {
    const { user:{upLindManId}, history } = this.props
    const { linkManId = '' } = obj
    linkManId && API.saveLastUserLindManId({ linkManId, noloading: 1 }).then(res => {
      const { code } = res
      if (!code) {
        upLindManId(obj)
        history.push(url)
      }
    })
  }

  tagChange = (item, name, index) => {
    console.log(item, name)
    this.setState({
      [name]: item.value,
    })
    if(name=='relationId'){
      this.state.birthday='';
    }
  }

  pickerOk = (value, tag) => {
    this.setState({[tag]: value})
    this.hidePicker();
  }

  // 显示隐藏省市区
  showPicker = (name = 'visible') => {
    const {relationId}=this.state;  
    if(name=='birthday'&&!relationId){
      return Toast.info('请先选择关系！')
    }
    this.setState({ pickerPop: name })
    
  }

  hidePicker = () => {
    this.setState({ pickerPop: '' })
  }

  addMonth = (date, offset) => {
    if (date instanceof Date && !isNaN(offset)) {
        let givenMonth = date.getMonth();
        let newMonth = givenMonth + offset;
        date.setMonth(newMonth);
        return date;
    }
    throw Error('argument type error');
  }

  getMaxDate = () => {
    this.setState({
      maxDate: this.addMonth(new Date(), 10)
    })
  }
  isLeapYear=(first,end)=>{
    let length=0;
    for (let i=first;i<end;i++) {
      if ((i%4==0&&i%100!=0)||(i%400==0)){
        length++; 
      }
    }
    return length;
  }
  getCurrent(){
    let date=new Date();
    let year=date .getFullYear();
    let month=date .getMonth()+1;
    let day=date .getDate();
    return year+'-'+month+'-'+day;
  }
  render () {
    const { birthday, addres, nation, expectDate, pickerPop, flag, sex, relationId, maxDate,
      bindUserName,} = this.state

    const {getParams,list,lists}=this.props;
    const { linkManId, id, barcode } = getParams

    
    let date=new Date();

    let leapYear1=this.isLeapYear(date.getFullYear()-18,date.getFullYear());//闰年个数 -18-now
    let leapYear2=this.isLeapYear(date.getFullYear()-150,date.getFullYear());//闰年个数 -150-now
    let during = 18*365*24*60*60*1000+(leapYear1*24*60*60*1000);
    let currentDate= new Date(date.getTime()-during);//当前日期-18周岁

    let duringEnd = 18*365*24*60*60*1000+(leapYear1*24*60*60*1000);
    let duringStart = 150*365*24*60*60*1000+(leapYear2*24*60*60*1000);
    let preDate= new Date(date.getTime()-duringStart);//当前日期-150周岁
    let nextDate= new Date(date.getTime()-duringEnd);//当前日期-18周岁

    return (
      <Page title='填写检测者信息'>
        <div className={styles.collectbox}>
          <div className={styles.genderbox}>
            {lists.map((rol, index) => (
              <div key={index} onClick={() => this.tagChange(rol, 'sex', index)}>
                <img className={sex === rol.value ? styles.on : ''} src={rol.icon} /><span>{rol.label}</span>
              </div>
            ))}
          </div>

          <ul className={styles.relationbox}>
            {list.length > 0 && list.map((rol, index) => (
              <li
                className={relationId === rol.value ? styles.on : ''}
                onClick={() => this.tagChange(rol, 'relationId', index)} 
                key={index}>
                  {rol.label}
                </li>
            ))}
          </ul>

          
          <ul className={`white from ${styles.from}`}>
            <li onClick={this.hadnleToast}>
              <div className={`${linkManId ? 'disabled' : ''}`}>
                <input
                  disabled={!!(linkManId)}
                  placeholder='你的姓名'
                  onBlur={() => {
                    isIos() && window.scrollBy(0, fixScroll().top)
                  }}
                  onChange={e => { this.setState({ bindUserName: e.target.value }) }} value={bindUserName || ''} />
              </div>
            </li>
            <li onClick={this.hadnleToast}>
              <div className={`${linkManId ? 'disabled' : ''}`} onClick={() => { this.showPicker('birthday') }}>
                <span style={{ color: !birthday ? '#ccc' : '#333' }}>你的生日</span>
                <span className={styles.tcr}>{fmtDate(birthday)}</span>
              </div>
            </li>

            {/* <li>
              <div className='item' onClick={() => { this.showPicker('addres') }}>
                <span style={{ color: !addres ? '#ccc' : '#333' }}>
                  {addres ? addres.join('-'): '你的户籍'}
                </span>
              </div>
            </li>
            <li>
              <div className='item' onClick={() => { this.showPicker('nation') }}>
                <span style={{ color: !nation ? '#ccc' : '#333' }}>
                  {nation ? nation[0] : '你的民族'}
                </span>
              </div>
            </li> */}

            {flag && <li onClick={this.hadnleToast}>
              <div className={`${linkManId ? 'disabled' : ''}`} onClick={() => {this.showPicker('expectDate')}}>
                <span style={{ color: !expectDate ? '#ccc' : '#333' }}>你的预产期</span>
                <span className={styles.tcr}>{fmtDate(expectDate)}</span>
              </div>
            </li>}
          </ul>
          
          

          <DatePicker
            mode='date'
            visible={pickerPop === 'birthday'}
            maxDate={relationId==3?now:nextDate}
            minDate={relationId==3?currentDate:preDate}
            format='YYYY-MM-DD'
            onOk={(e) => this.pickerOk(e, 'birthday')}
            onDismiss={this.hidePicker}
          />
          <DatePicker
            mode='date'
            visible={pickerPop === 'expectDate'}
            minDate={now}
            maxDate={maxDate}
            value={expectDate}
            format='YYYY-MM-DD'
            onOk={(e) => this.pickerOk(e, 'expectDate')}
            onDismiss={this.hidePicker}
          />
          <Picker
            visible={pickerPop === 'addres'}
            data={AddresList}
            cols={3}
            onOk={(e) => this.pickerOk(e, 'addres')}
            onDismiss={this.hidePicker}
          />
          <Picker
            visible={pickerPop === 'nation'}
            data={nationMap}
            cols={1}
            onOk={(e) => this.pickerOk(e, 'nation')}
            onDismiss={this.hidePicker}
          />
          <div className='foot' onClick={this.bindUser} >
            <button className={`btn ${styles.foot} ${id || barcode ? styles.bg : ''}`}>
              提交</button>
          </div>
        </div>
      </Page>
    )
  }
}
export default BindUserNew
