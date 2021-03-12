import React from 'react'

class EyeDom extends React.Component {
  render() {
    const { domArr, linkManId, leftEye, rightEye, sex, RunShowPicker } = this.props
    const len = domArr.length
    let valueTag = sex
    let placeTex = sex ? (sex == 'male' ? '男' : '女') : '性别'

    return (
      <React.Fragment>
        {domArr.map((item, index) => {
          if (len === 2) {
            valueTag = index ? rightEye : leftEye
            placeTex = valueTag || (index ? '右眼视力（选填）' : '左眼视力（选填）')
          }
          return <li key={index}>
            <div className={`${linkManId ? 'disabled' : ''} `} onClick={() => RunShowPicker(item)}>
              <span style={{ color: !valueTag ? '#ccc' : '#333' }}>{ placeTex }</span>
            </div>
          </li>
        })}
      </React.Fragment>
    )
  }
}
export default EyeDom
