import React from 'react'
import propTypes from 'prop-types'
import styles from './nav.scss'
import { images, fun } from '@src/common/app'
const { returnNumByDay } = fun
class NavList extends React.Component {
  state = {
    navList: [{
      name: '首页',
      img: images.iconIndex,
      activedImg: images.iconIndexActived
    }, {
      name: '测评',
      img: images.iconCurve,
      activedImg: images.iconCurveActived
    }, {
      name: '发现',
      img: images.iconFind,
      activedImg: images.iconFindActived
    }, {
      name: '更多',
      img: images.iconMore,
      activedImg: images.iconMoreActived
    }]
  }
  componentDidMount () {
    const num = returnNumByDay()
    if (num === 1) {
      this.setState({
        navList: [{
          name: '首页',
          img: images.iconIndexShengdan,
          activedImg: images.iconIndexShengdanActived
        }, {
          name: '测评',
          img: images.iconCurveShengdan,
          activedImg: images.iconCurveShengdanActived
        }, {
          name: '发现',
          img: images.iconFindShengdan,
          activedImg: images.iconFindShengdanActived
        }, {
          name: '更多',
          img: images.iconMoreShengdan,
          activedImg: images.iconMoreShengdanActived
        }]
      })
    } else if (num === 2) {
      this.setState({
        navList: [{
          name: '首页',
          img: images.iconIndexYuandan,
          activedImg: images.iconIndexYuandanActived
        }, {
          name: '测评',
          img: images.iconCurveYuandan,
          activedImg: images.iconCurveYuandanActived
        }, {
          name: '发现',
          img: images.iconFindYuandan,
          activedImg: images.iconFindYuandanActived
        }, {
          name: '更多',
          img: images.iconMoreYuandan,
          activedImg: images.iconMoreYuandanActived
        }]
      })
    }
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
