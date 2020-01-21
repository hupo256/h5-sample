import React from 'react'
import PropTypes from 'prop-types'
import styles from './index.scss'
class Modal extends React.Component {
  static propTypes = {
    handleToggle: PropTypes.func,
    style: PropTypes.object,
    visible: PropTypes.bool,
    type:PropTypes.number,
  }
  render () {
    const { visible, handleToggle, style, type } = this.props
    return visible ? (
      <div>
        <div
          className={`${styles.flexdModal} ${type < 4 ? styles.flexdModal1 : styles.flexdModal2}`}
          onClick={handleToggle} style={{ zIndex:style && style.zIndex ? style.zIndex - 1 : 222 }}
        />
      </div>
    ) : ''
  }
}

export default Modal
