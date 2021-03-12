import React from 'react'
import ContentLoader, { Facebook, Code, Instagram } from 'react-content-loader'
import PropTypes from 'prop-types'

const MyLoader = () => (
  <ContentLoader
    height={667}
    width={375}
    speed={4}
    primaryColor='#f3f3f3'
    secondaryColor='#fff0ee'
  >
        <rect id="矩形" fill="#FFF4F2" x="67" y="429" width="216" height="21" rx="2"></rect>
        <rect id="矩形备份" fill="#FFF4F2" x="204" y="468" width="151" height="189" rx="2"></rect>
        <rect id="矩形备份-2" fill="#FFF4F2" x="20" y="468" width="151" height="189" rx="2"></rect>
        <path d="M0,0 L375,0 L375,240 C312.5,259.333333 250,269 187.5,269 C125,269 62.5,259.333333 0,240 L0,0 Z" id="矩形" fill="#FFF4F2"></path>
        <rect id="矩形" fill="#FFF4F2" x="20" y="289" width="335" height="111" rx="2"></rect>
        <circle id="椭圆形" fill="#FFF4F2" cx="41" cy="440" r="12"></circle>
  </ContentLoader>
)

export { MyLoader, Facebook, Code, Instagram }
