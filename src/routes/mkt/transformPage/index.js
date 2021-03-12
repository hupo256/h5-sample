import React from 'react'
import propTypes from 'prop-types'
import { fun } from '@src/common/app'
import { Page } from '@src/components'
import {
  trackPointLandingpage101View
} from './buried-point'
const { getParams } = fun
class TransformPage extends React.Component {
  state = {
  }
  componentDidMount () {
    const { code } = getParams()
    trackPointLandingpage101View({
      viewtype: code
    })
    if (code === '101') {
      window.location.href = `${origin}/unlock-land?viewType=QR`
    } else if (code === '102') {

    } else {
      window.location.href = `${origin}/unlock-land?viewType=QR`
    }
  }

  render () {
    return (
      <Page title=''>
        <div />
      </Page>
    )
  }
}
TransformPage.propTypes = {
  history: propTypes.object,
}
export default TransformPage
