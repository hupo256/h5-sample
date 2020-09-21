import React from 'react'
import ContentLoader, { Facebook, Code, Instagram } from 'react-content-loader'
import PropTypes from 'prop-types'

const SearchLoader = () => (
  <ContentLoader
    height={667}
    width={375}
    speed={4}
    primaryColor='#f3f3f3'
    secondaryColor='#fff0ee'
  >
    <rect id='矩形' fill='#FFF4F2' x='20' y='122' width='332' height='28' rx='14' />
    <rect id='矩形备份-3' fill='#FFF4F2' x='121' y='79' width='134' height='28' rx='14' />
    <rect id='矩形备份-2' fill='#FFF4F2' x='20' y='338' width='335' height='111' rx='2' />
    <rect id='矩形备份-4' fill='#FFF4F2' x='20' y='191' width='335' height='111' rx='2' />
    <rect id='矩形备份-5' fill='#FFF4F2' x='20' y='485' width='335' height='111' rx='2' />
    <rect id='矩形' fill='#FFF4F2' x='20' y='20' width='332' height='35' rx='17.5' />

  </ContentLoader>
)

export { SearchLoader, Facebook, Code, Instagram }
