import React from 'react'
import PropTypes from 'prop-types'
class Check extends React.Component {
  render () {
    const { label = '', className, onChange, ...obj } = this.props
    return (
      <div className='imgCenter'>
        <label htmlFor={this.props.id} className={'radio ' + className}>
          <span className='radio-bg' />
          <input
            {...obj}
            onChange={e => {
              const check = e.target.checked
              const val = check ? e.target.value : ''
              onChange(val)
            }}
          />{label}
          <span className='radio-on' />
        </label>
      </div>
    )
  }
}
Check.propTypes = {
  type:PropTypes.string,
  value:PropTypes.string,
  onChange:PropTypes.func,
  name:PropTypes.string,
  id:PropTypes.string,
  label:PropTypes.string,
  className:PropTypes.string
}
export default Check
