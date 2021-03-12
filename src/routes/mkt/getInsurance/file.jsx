import React, { Component } from 'react'
import { Page } from '@src/components'
import { fun } from '@src/common/app'
const { getParams } = fun
import { observer, inject } from 'mobx-react'

@inject('springFission')
@observer
class BannerCard extends Component {
    state = {
        title: '',
        picUrl: ''
    }
    componentDidMount() {
        const { picUrl } = getParams()
        const { springFission: { data: { title } } } = this.props
        this.setState({
            title, picUrl
        })
    }
    render() {
        const { title, picUrl } = this.state
        return (
            <Page title={title}>
                <img src={picUrl} alt="" />
            </Page>
        )
    }
}

export default BannerCard
