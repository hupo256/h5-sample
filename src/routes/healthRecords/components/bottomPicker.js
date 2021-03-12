import React, { Component } from 'react'
import propTypes from 'prop-types'
import styles from '../index.scss'
import images from '../images'
class BottomPicker extends Component {
  static propTypes = {
    handleClose: propTypes.func,
    handleEditInfo:propTypes.func,
    handleRemove:propTypes.func,
    type:propTypes.number,
    shipList:propTypes.array,
    relationshipId:propTypes.number,
    handleChooseThisShip: propTypes.func,
  }
  render () {
    const { type, handleClose, handleEditInfo, handleRemove, shipList, relationshipId, handleChooseThisShip } = this.props
    return (
      <div className={`${styles.picker} ${type === 1 ? styles.picker2 : styles.picker3}`}>
        {
          type === 1
            ? <div>
              <div className={styles.top}>
                <span>选择亲友信息</span>
                <img src={images.close} onClick={handleClose} />
              </div>
              <div className={styles.scrollBox}>
                <div className={styles.ships} onClick={handleEditInfo}>
                  修改亲友关系
                </div>
                <div className={styles.ships} onClick={handleRemove}>
                  解除绑定
                </div>
              </div>
            </div>
            : type === 2
              ? <div>
                <div className={styles.top}>
                  <span>选择关系</span>
                  <img src={images.close} onClick={handleClose} />
                </div>
                <div className={styles.scrollBox}>
                  {
                    shipList.map((item, index) => (
                      <div className={styles.ships} key={index} onClick={() => handleChooseThisShip(item)}>
                        <label>{item.relationName}</label>
                        {
                          relationshipId === shipList[index].id ? <img src={images.choosed2} /> : ''
                        }
                      </div>
                    ))
                  }
                </div>
              </div>
              : ''
        }
      </div>
    )
  }
}
export default BottomPicker
