import React from 'react'
import images from './images'
import Modal from '@src/components/modal'
import { observer, inject } from 'mobx-react'

const { yinyang } = images

@inject('yinyang')
@observer
class ImgTips extends React.Component {
  state = {
    show: false
  }

  toggleMask = (key) => {
    const { yinyang: { toggleNoscroll } } = this.props
    toggleNoscroll()
    this.setState({
      [key]: !this.state[key]
    })
  }

  createRuleInfor = (json) => {
    const texArr = json.split('|')
    return texArr.map(tex => tex.trim())
  }

  render () {
    const { show } = this.state
    const { illustrationDto } = this.props
    return (
      <React.Fragment>
        <img src={images.tips} onClick={() => this.toggleMask('show')} />

        <Modal
          handleToggle={() => { this.toggleMask('show') }}
          type
          visible={show}>
          <div>
            <h3>{illustrationDto.title}</h3>
            {/* <p>{illustrationDto.content}</p>  */}
            <p dangerouslySetInnerHTML={{ __html: illustrationDto.content || '' }} />
          </div>
        </Modal>
      </React.Fragment>
    )
  }
}

export default ImgTips
