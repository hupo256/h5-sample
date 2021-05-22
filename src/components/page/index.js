import React from 'react'
import wxconfig from '@src/common/utils/wxconfig'
class Page extends React.Component {
  state = {
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
  }
  render() {
    return <div className={`page ${this.props.class || ''}`}>{this.props.children}</div>
  }
}

export default Page
