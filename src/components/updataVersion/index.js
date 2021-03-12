import React from 'react'
import PropTypes from 'prop-types'
import styles from './index.scss'
import UA from '@src/common/utils/ua'
import andall from '@src/common/utils/andall-sdk'
const { isAndall } = UA

class UpdataVersion extends React.Component {
  static propTypes = {
    value: PropTypes.string,
    version:PropTypes.number
  }
  state={
    updataVersionVisible:false
  }
  componentDidMount() {
    if (isAndall()) {
      const nowVersion = andall.info.version.replace(/\./g, '')
      if (+nowVersion < this.props.version) {
        this.setState({
          updataVersionVisible:true
        })
      }
    }
  }
  goBack = () => {
    andall.invoke('goHome')
  }
  render () {
    const { value } = this.props
    const { updataVersionVisible } = this.state
    return (
      updataVersionVisible
        ? <div className={styles.pupopbox}>
          <div className={styles.pupcon}>
            <p>{value}</p>
            <span onClick={this.goBack} className={styles.knowBtn}>我知道了</span>
          </div>
        </div>
        : ''
    )
  }
}

export default UpdataVersion
