import React from 'react'
import styles from '../binding'
import andall from '@src/common/utils/andall-sdk'
import { trackPointBindCompletePageBannerGoto } from '../buried-point'
import isChoose from '@static/bindSuccess/isChoose.png'
import noChoose from '@static/bindSuccess/noChoose.png'

class BannerItem extends React.Component {
    state = {
        ids: []
    }
    changeChoose = (id, e) => {
        const { ids } = this.state;
        const { prop } = this.props;
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        if (ids.includes(id)) {
            ids.splice(ids.indexOf(id), 1)
        } else {
            ids.push(id)
        }
        this.setState({
            ...ids
        })
        prop.setState({
            getIds: ids
        })
    }

    goDetail = (id) => {
        trackPointBindCompletePageBannerGoto({ url: window.location.href });
        andall.invoke("goProductDetail", { productId: id, newProductDetailType: 5 })
    }

    render() {
        const { itemList } = this.props
        const { ids } = this.state;
        return (
            <div className={styles.listBanner}>
                {itemList.map((item, index) => {
                    return (
                        <div className={styles.bannerList} key={index} onClick={() => this.goDetail(item.productId)}>
                            <div className={styles.bannerItem}>
                                <div className={styles.itemImage}>
                                    <img src={item.pictureUrl} />
                                </div>
                                <div className={styles.itemContent}>
                                    <h3>{item.productName}</h3>
                                    <p className={styles.contentDes}>{item.productDesc}</p>
                                    <div className={styles.contentData}>
                                        <p><span>¥</span>{item.unlockPrice}</p>
                                        <p>¥{item.productOriginPrice}</p>
                                        <p>已售:{item.salesVolume}</p>
                                    </div>
                                </div>
                                <div className={styles.unlockIcon}></div>
                                <div className={styles.chooseWrap} onClick={(e) => this.changeChoose(item.productId, e)}>
                                    <img src={ids.includes(item.productId) ? isChoose : noChoose} />
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

        )
    }
}
export default BannerItem;