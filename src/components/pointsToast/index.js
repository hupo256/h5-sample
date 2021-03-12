import React from 'react'
import PropTypes from 'prop-types'
import styles from './toast.scss'
import bodymovin from 'bodymovin'
import animationData from './lottie.json'
import fun from '@src/common/utils'
const { isTheAppVersion } = fun

class NoData extends React.Component {
  static propTypes = {
    value: PropTypes.number,
  }
  state={
    isToast:true
  }
  componentDidMount() {
    if (isTheAppVersion('1.6.9')) {
      bodymovin.loadAnimation({
        container: this.refs.demo,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData
      })
      setTimeout(() => {
        this.setState({
          isToast:false
        })
      }, 2000)
    }
  }
  render () {
    const { value } = this.props
    const { isToast } = this.state
    return (
      <div>
        {
          isToast && isTheAppVersion('1.6.9')
            ? <div className={styles.toast}>
              <span>+{value}</span>
              <label ref='demo' id='demo' />
            </div>
            : null
        }
      </div>

    )
  }
}

export default NoData
