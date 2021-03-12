import React from 'react'
import propTypes from 'prop-types'
import styles from './nav.scss'
import iconIndex from '@static/height/icon_index.png'
import iconIndexActived from '@static/height/icon_index_actived.png'
import iconCurve from '@static/height/icon_curve.png'
import iconCurveActived from '@static/height/icon_curve_actived.png'
import iconFind from '@static/height/icon_find.png'
import iconFindActived from '@static/height/icon_find_actived.png'
import iconMore from '@static/height/icon_more.png'
import iconMoreActived from '@static/height/icon_more_actived.png'
class NavList extends React.Component {
  state = {
    navList: [{
      name: '首页',
      img: iconIndex,
      activedImg: iconIndexActived
    }, {
      name: '测评',
      img: iconCurve,
      activedImg: iconCurveActived
    }, {
      name: '发现',
      img: iconFind,
      activedImg: iconFindActived
    }, {
      name: '更多',
      img: iconMore,
      activedImg: iconMoreActived
    }]
  }
  componentDidMount () {
  }
  render () {
    const { navList } = this.state
    const { actived, changeActived } = this.props
    return (
      <div className={styles.navCont}>
        <ul>
          {
            navList && navList.length
              ? navList.map((item, index) => {
                return <li key={index} onClick={() => changeActived(index)}>
                  <img src={actived === index ? item.activedImg : item.img} alt='' />
                  <p className={styles.name}>{item.name}</p>
                </li>
              })
              : ''
          }
        </ul>
      </div>
    )
  }
}
NavList.propTypes = {
  actived: propTypes.number,
  selected: propTypes.object,
  changeActived: propTypes.func,
  cancel: propTypes.func,
}
export default NavList
