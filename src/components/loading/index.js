import React from 'react'
import Loadable from 'react-loadable'
import styles from './nodata.scss'
import img from '@static/error.png'
const DefaultLoading = ({ isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="loader">
        <div className="loader-inner ball-scale-ripple-multiple">
          <div />
          <div />
          <div />
        </div>
      </div>
    )
  } else if (error) {
    console.log(error)
    return (
      <div className={styles.noData}>
        <img className={styles.noImg} src={img} />
        <p>页面异常了啊！刷新试试</p>
        <div className={styles.nobtn}>
          <button
            className="btn"
            onClick={() => {
              window.location.reload()
            }}
          >
            刷新
          </button>
        </div>
      </div>
    )
  } else {
    return null
  }
}

export default (loader, loading = DefaultLoading) => {
  return Loadable({
    loader,
    loading,
  })
}
