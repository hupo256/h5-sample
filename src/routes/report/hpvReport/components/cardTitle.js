import React, { Component } from 'react'
import propTypes from 'prop-types'
import styles from '../hpvReport.scss'

import images from '../images'

class CardTitle extends Component {
    static propTypes = {
      title: propTypes.string.isRequired,
    }
      state = {
      }
      componentDidMount() {

      }
      render() {
        return (
          <div className={`${styles.cardTitle} ${this.props.title === '你的测评结果' ? styles.noBottom : ''}`}>
            <img src={images.title} />
            <span>{this.props.title}</span>
          </div >
        )
      }
}

export default CardTitle
