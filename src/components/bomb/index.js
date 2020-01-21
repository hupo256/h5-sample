import React from 'react'
import propTypes from 'prop-types'
import styles from './bomb.scss'

class Bomb extends React.Component {
  static propTypes = {
    bodyCont: propTypes.string.isRequired,
    footers: propTypes.array.isRequired
  }

  render () {
    const { bodyCont, footers } = this.props
    return (
      <div className={styles.bombCont}>
        <div className={styles.cont}>
          <div className={styles.body} dangerouslySetInnerHTML={{ __html: bodyCont }} />
          <div className={styles.footer}>
            {
              footers ? footers.map((item, index) => {
                return <span key={index} onClick={item.event} style={{ 'color': item.color }}>
                  {item.name}
                </span>
              }) : null
            }
          </div>
        </div>
      </div>
    )
  }
}

export default Bomb
