import React from 'react'
import PropTypes from 'prop-types'
import { Modal } from '@src/components'

class RulePop extends React.Component {
  static propTypes = {
    modalToggle: PropTypes.func.isRequired,
    showRule: PropTypes.bool.isRequired,
    remark: PropTypes.string.isRequired
  }

  createRuleInfor = (json) => {
    const texArr = json.split('|')
    return texArr.map(tex => tex.trim())
  }

  render () {
    const { remark, showRule, modalToggle } = this.props
    return (
      <Modal
        handleToggle={() => { modalToggle('showRule') }}
        type
        visible={showRule}>
        <div>
          {this.createRuleInfor(remark).map((tex, index) => {
            if(index === 0){
              return <h3 key={index}>{tex}</h3>
            } else {
              return <p key={index}>{tex}</p>
            }
          })}
        </div>
      </Modal>
    )
  }
}
export default RulePop

