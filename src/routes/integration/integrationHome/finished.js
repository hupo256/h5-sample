import React from 'react'
import propTypes from 'prop-types'
import { Page } from '@src/components'
import styles from './home.scss'

class Finished extends React.Component {
  state = {
  }
  componentDidMount () {
    console.log(this.props.history.location.state)
  }

  render () {
    return (
      <Page title='历史任务'>
        {
          <div className={`${styles.finished}`}>
            {
              this.props.history.location.state.list.map((item, index) => (
                <div key={index} className={styles.list}>
                  <div className={styles.borderBottom}>
                    <div>
                      <img src={item.icon} />
                      <p>{item.taskName}</p>
                    </div>
                    <span>已完成</span>
                  </div>
                </div>
              ))
            }
          </div>
        }
      </Page>
    )
  }
}
Finished.propTypes = {
  history: propTypes.object,
}
export default Finished
