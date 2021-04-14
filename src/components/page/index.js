import React from 'react'
import PropTypes from 'prop-types'
import wxconfig from '@src/common/utils/wxconfig'
import ua from '@src/common/utils/ua'
const { isIos, isAndall } = ua
class Page extends React.Component {
  state = {
    isAndall: isAndall(),
    title: '',
  }
  componentDidMount() {
    const { config = true } = this.props
    config && wxconfig()

    let { title } = this.props
    this.setDocumentTitle(title)
    document.getElementById('skeleton').style.display = 'none'
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.title) {
      this.setDocumentTitle(nextProps.title)
    }
  }
  // 动态修改title
  setDocumentTitle = (title) => {
    document.title = title
    if (isIos()) {
      let i = document.createElement('iframe')
      i.style.display = 'none'
      i.onload = () => {
        setTimeout(() => {
          i.remove()
        }, 9)
      }
      document.body.appendChild(i)
    }
  }
  render() {
    return <div className={`page ${this.props.class || ''}${this.state.isAndall ? 'andallPage' : ''}`}>{this.props.children}</div>
  }
}

Page.propTypes = {
  // title: PropTypes.string.isRequired,
  // config: PropTypes.bool,
  // class: PropTypes.string,
}

export default Page
