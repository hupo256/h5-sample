import React from 'react'

class Ruler extends React.Component {
  createRuleInfor = (json) => {
    const texArr = json.split('|')
    return texArr.map(tex => tex.trim())
  }

  render () {
    const { remark } = this.props
    return (
      <div>
        {remark && this.createRuleInfor(remark).map((tex, index) => {
          if(index === 0){
            return <h3 key={index}><span>{tex}</span></h3>
          } else {
            return <p key={index}>{tex}</p>
          }
        })}
      </div>
    )
  }
}

export default Ruler
