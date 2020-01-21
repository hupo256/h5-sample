import React from 'react'
import PropTypes from 'prop-types'
import styles from './noresult.scss'
import noResult from '@static/no_result.png'
class NoResult extends React.Component {
  static propTypes = {
    image: PropTypes.string,
    text: PropTypes.string,
  }
  render () {
    const { image, text } = this.props
    return (
      <div className={styles.noResult}>
        <img src={image || noResult} />
        <p>{text}</p>
      </div>
    )
  }
}

export default NoResult
