import React, { Component } from 'react'
import propTypes from 'prop-types'
import styles from '../detailAn'
import images from './imagesAn'

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
        <div className={`${styles.cardTitle} ${this.props.title === '有益菌' || this.props.title === '菌群分类' ? styles.top0 : ''}`}>
          <img src={images.circle} />
          <span>{this.props.title}</span>
        </div >
      )
    }
}

export default CardTitle
