import React from 'react'
import propTypes from 'prop-types'
import { Carousel } from 'antd-mobile'
class Banner extends React.Component {
  static propTypes = {
    setting: propTypes.object,
    height: propTypes.number,
    data: propTypes.array.isRequired
  }
  render () {
    const { setting = {}, height, data } = this.props
    return (
      <div className='banner' style={{ height }}>
        <Carousel
          infinite
          {...setting}
        >
          {data.map(item => (
            <a 
              key={item.id}
              href={`/#/commodity/?id=414134`}
              style={{ display: 'inline-block', width: '100%', height:height || 200 }}
            >
              <img
                src={item.bannerPicUrl}
                alt=''
                style={{ width: '100%', height:'100%', verticalAlign: 'top' }}
                onLoad={() => {
                  window.dispatchEvent(new Event('resize'))
                }}
              />
            </a>
          ))}
        </Carousel>
      </div>
    )
  }
}

export default Banner
