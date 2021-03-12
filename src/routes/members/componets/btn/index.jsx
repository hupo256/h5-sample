import React from 'react'
import styles from './btn'

const getBtn = (con, fun) => {
  return <button className={styles.toBuy} onClick={fun}>{con}</button>
}

class MemberBtn extends React.Component {
  render () {
    const { conTex, togglefunc, userState, footer } = this.props
    return (
      <React.Fragment>
        {(userState === 1 || userState === 3) ? 
          footer ? 
            <div className={styles.footerBox}>
              {getBtn(conTex, togglefunc)}
            </div> : 
            (userState !== 3) && getBtn(conTex, togglefunc)
          : ''
        }
      </React.Fragment>
    )
  }
}

export default MemberBtn
