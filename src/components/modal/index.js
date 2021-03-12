import React from 'react'
import PropTypes from 'prop-types'
import styles from './index.scss'
class Modal extends React.Component {
  static propTypes = {
    children: PropTypes.element,
    handleToggle: PropTypes.func,
    style: PropTypes.object,
    visible: PropTypes.bool,
    type: PropTypes.bool,
  }

  render() {
    const { children, visible, handleToggle, style, type, closeFun } = this.props
    return visible ? (
      <div>
        <div
          className={styles.flexdModal}
          onClick={handleToggle}
          style={{ zIndex: style && style.zIndex ? style.zIndex - 1 : 222 }}
        />
        <div
          className={styles.modal}
          style={{ ...style }}>
          {type ? <span className={styles.close} onClick={closeFun || handleToggle} /> : ''}
          {children}
        </div>
      </div>
    ) : (
        ''
      )
  }
}

export default Modal
