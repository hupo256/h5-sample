import React from 'react'
import PropTypes from 'prop-types'

class Router extends React.Component {
  state = {
    bool: false,
  }
  componentDidMount() {
    this.setState({ bool: true })
  }

  // 获取初始化数据
  init = (n) => {
    this.setState({ bool: true })
  }

  render() {
    const { bool } = this.state
    return <React.Fragment>{bool ? this.props.children : ''}</React.Fragment>
  }
}
Router.propTypes = {
  children: PropTypes.object,
}

export default Router
