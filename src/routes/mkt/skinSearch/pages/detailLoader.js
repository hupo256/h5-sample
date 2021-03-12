import React from 'react'
import ContentLoader, { Facebook, Code, Instagram } from 'react-content-loader'
import PropTypes from 'prop-types'

const DetailLoader = () => (
  <ContentLoader
    height={667}
    width={375}
    speed={4}
    primaryColor='#f3f3f3'
    secondaryColor='#fff0ee'
  >
        <rect id="矩形" fill="#FFF4F2" x="0" y="0" width="375" height="200"></rect>
        <rect id="矩形" fill="#FFF4F2" x="19" y="223" width="272" height="24" rx="2"></rect>
        <rect id="矩形备份-16" fill="#FFF4F2" x="19" y="254" width="82" height="18" rx="2"></rect>
        <rect id="矩形备份-17" fill="#FFF4F2" x="19" y="280" width="147" height="18" rx="2"></rect>
        <circle id="椭圆形" fill="#FFF4F2" cx="346.5" cy="342.5" r="9.5"></circle>
        <rect id="矩形备份" fill="#FFF4F2" x="62" y="334" width="216" height="21" rx="2"></rect>
        <circle id="椭圆形" fill="#FFF4F2" cx="33" cy="342" r="13"></circle>
        <rect id="矩形" fill="#FFF4F2" x="20" y="384" width="336" height="246" rx="2"></rect> 
  </ContentLoader>
)

export { DetailLoader, Facebook, Code, Instagram }
