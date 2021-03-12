import React from 'react'
import styles from './linkManList.scss'
import closeMask from '@static/user/closeMask.png'
import manicon1 from '@static/user/manicon1.png'
import manicon2 from '@static/user/manicon2.png'
import manicon3 from '@static/user/manicon3.png'
import manicon4 from '@static/user/manicon4.png'
import selected from '@static/user/selected.png'
const manicon = [null, manicon1, manicon2, manicon3, manicon4]
class LinkMans extends React.Component {
  render() {
    const { manList, switchTheMan, toggleMask, showList, curLinkManId, hideClose } = this.props
    // manList,数组,绑定人数组信息
    // switchTheMan, 方法,传入id进行项目各自的业务逻辑
    // toggleMask, 方法,关闭图层,需要与showList配合使用
    // showList, 布尔,为真显示，为假隐藏
    // curLinkManId, 数字,当前用户id，用以判断是否选中状态
    // hideClose , 布尔，为真隐藏关闭标志
    return (
      <div className={styles.swiper}>
        {showList && <div className={styles.bottomMask} onClick={toggleMask ? () => toggleMask(false) : null}>
          <div className={styles.manListOut}>
            <div className={styles.titMans}>
              <span>切换检测人</span>
              {
                hideClose ? null : <img src={closeMask} />
              }
            </div>
            {manList && manList.length > 0 && <ul>
              {manList.map((item, index) => {
                const { id, relationId, userName, sex, linkManId, usableStatus } = item
                const cur = id === curLinkManId
                return <li
                  key={index}
                  onClick={() => switchTheMan(id || linkManId, usableStatus, index)}
                  className={item.usableStatus === 0 ? styles.unusable : ''}
                >
                  <img src={manicon[relationId == 3 ? (sex == 'female' ? 4 : 3) : (sex == 'female' ? 2 : 1)]} />
                  <i>{`${userName} ${relationId == 3 ? '(宝宝)' : '(成人)'}`}</i>
                  {cur && <img className={styles.selected} src={selected} />}
                </li>
              })}
            </ul>}
          </div>
        </div>}
      </div>)
  };
}

export default LinkMans
