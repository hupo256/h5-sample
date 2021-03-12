import React from 'react'
import PropTypes from 'prop-types'
import styles from './index.scss'
import { Modal , List} from 'antd-mobile'
import images from '@src/common/utils/images'
const { bindOnly,disease } = images
class CheckModal extends React.Component {
  static propTypes = {
    children: PropTypes.array,
    onClose: PropTypes.func,
    visible: PropTypes.bool,
    title: PropTypes.string,

  }
  constructor (props) {
    super(props)
  }
  toOrder=(i)=>{
   
  }
  render() {
    const { children, visible, onClose,title} = this.props;
    return (
        <Modal
            popup
            visible={visible}
            animationType="slide-up"
            onClose={onClose}
            closable={true}
            className='my_modal'
            >
            <List renderHeader={() => <div className={styles.title}>{title}</div>} className="popup-list">
                {children&&children.length&&children.map((i, index) => (
                <List.Item key={index} 
                className={i.usableStatus==0?styles.itemDisable:''}
                onClick={()=>{this.props.toOrder(i,index)}}
                >
                    <div className={styles.leftImg}>
                      <div>
                        <img src={`${disease}img${i.headImgType}.png`} className={styles.headImg} />
                        <span>{i.userName} （{i.relationName}）</span>
                      </div>
                      
                      {
                        i.isCheck&&<img src={`${disease}checkeds.png`} className={styles.check} />
                      }
                      
                    </div>
                </List.Item>
                ))}

            </List>
        </Modal>
      
      )
  }
}

export default CheckModal
