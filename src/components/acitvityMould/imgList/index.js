import React from 'react'
import styles from '../mould'

class ImgList extends React.Component {
    state = {

    }

    render () {
      const { dataList } = this.props;
      return (
        <div className={styles.imgListWrap}>
          {dataList.map((item,index) => {
            return <img src={item} key={index} />
          })}
        </div>
      )
    }
}

export default ImgList
