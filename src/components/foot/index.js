import React from 'react'
import PropTypes from 'prop-types'
import { NavLink, Link } from 'react-router-dom'
import { observer, inject } from 'mobx-react'
import { point } from '@src/common/app'

const { allPointTrack } = point

@inject('user')
@observer
class Foot extends React.Component {
  state = {
    foot:[
      {
        name:'商城',
        link:'/'
      },
      {
        name:'报告',
        link:{
          pathname: '/report',
          search: '?viewtype=1'
        }
      },
      {
        name:'采样器',
        link:{
          pathname: '/sampling',
          search: '?viewtype=mallmenu'
        }
      },
      {
        name:'我的',
        link:'/user'
      }
    ]
  }
  // 埋点记录menu名称
  trackPointMenu (item) {
    let obj = {
      eventName:'mall_menu_click',
      pointParams:{ menu_name:item.name }
    }
    allPointTrack(obj)
  }

  componentDidMount () {
    const { linkMan = {}, user:{getNotReadReportIdentification} } = this.props
    getNotReadReportIdentification(linkMan.linkManId)
  }

  render () {
    const { number = 0, type, unRead = 1 } = this.props

    return (
      <div>
        {
          type && number ? (
            <div className='catIcon'>
              <Link to='/cat'>
                {number > 0 ? <div className='bage'><span>{number}</span></div> : ''}
              </Link>
            </div>
          ) : ''
        }
        <footer className='flex foot borderTop'>
          {
            this.state.foot.map((item, i) => (
              <div className='item foot-item' key={i} onClick={() => { this.trackPointMenu(item) }}>
                <NavLink to={item.link} activeClassName='active' exact>
                  <span className='footIcon' />
                  <span>{item.name}</span>
                </NavLink>
                {
                  i === 1 && +unRead === 2
                    ? <span className='unread' /> : null
                }

              </div>
            ))
          }
        </footer>
      </div>
    )
  }
}
Foot.propTypes = {
  number:PropTypes.number,
  unRead: PropTypes.number,
  type:PropTypes.bool,
  linkMan: PropTypes.object.isRequired,
  getNotReadReportIdentification: PropTypes.func.isRequired
}
export default Foot
