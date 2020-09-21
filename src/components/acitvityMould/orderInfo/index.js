import React from 'react'
import styles from '../mould'
import isUnlock from '@static/newUserComponent/isUnlock.png'

class OrderInfo extends React.Component {
    render () {
        const {dataList,reqProductIds,chooseID} = this.props

        return (
            <div>
                {dataList.map((item,index)=>{
                    return(
                        <div className={styles.orderDetail} key={index}>
                            <div className={styles.orderImg}>
                                <img src={item.indexPicUrl} className={`${reqProductIds && reqProductIds.includes(item.productId)?null:styles.opacitySet}`}/>
                              {reqProductIds && reqProductIds.includes(item.productId)?null:<img src={isUnlock} />}
                            </div>
                            <div className={`${styles.orderName} ${reqProductIds && reqProductIds.includes(item.productId)?null:styles.opacitySet}` }>
                                <h3>{item.productName}</h3>
                                <div>
                                    {/* 有优惠价就显示优惠价及原始价，没有就只显示原始价 */}
                                    <p><span>￥</span>{chooseID==="newuser"?item.productPrice:item.unlockPrice}</p>
                                    {chooseID==="newuser" && item.productOriginPrice>item.productPrice && <p>￥{item.productOriginPrice}</p>}
                                    {chooseID!=="newuser" && item.unlockOriginPrice>item.unlockPrice && <p>￥{item.unlockOriginPrice}</p>}
                                    {/* {reqProductIds.includes(item.productId)?null:<p>已解锁</p>} */}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

        )
    }
}

export default OrderInfo
