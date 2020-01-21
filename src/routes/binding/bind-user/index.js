
import React from 'react'
import { BindUserNew } from '@src/components'
import manIcon from '@static/bindOnly/manIcon.png'
import womanIcon from '@static/bindOnly/womanIcon.png'
import { fun, ua, API, point } from '@src/common/app'
const { getParams } = fun
const lists = [
  {
    label: '男',
    value: 'male',
    icon: manIcon
  },{
    label: '女',
    value: 'female',
    icon: womanIcon,
  },
]

class BindUser extends React.Component {
  state = {
    list: [],
  }
  componentDidMount(){
    API.relationListAll({noloading:1 }).then(res => {
      const { code, data } = res
      const list = []
      const listReation = {}
      if (!code) {
        data.map((item, i) => {
          const { id, relationName } = item
          list.push({
            label: relationName,
            value: id
          })
          listReation[id] = relationName
        })
        this.setState({ list, listReation })
      }
    })
  }
  render () {
    // const { birthday, addres, nation, expectDate, pickerPop, flag, sex, relationId, maxDate,
    //   bindUserName, list} = this.state
    // const { linkManId, id, barcode } = getParams()
    const {list}=this.state;
    return (
      <BindUserNew {...this.props} lists={lists} list={list} getParams={getParams()}  />
    )
  }
}
export default BindUser
