import React from 'react'
import ContentLoader, {Facebook, Code, Instagram} from 'react-content-loader';

const MyLoader = () => (
  <ContentLoader 
    height={667}
    width={375}
    speed={2}
    primaryColor="#f3f3f3"
    secondaryColor="#ecebeb"
  >
    <rect x="15" y="36" width="71" height="14"></rect>
    <rect x="15" y="14" width="103" height="14"></rect>
    <rect x="44" y="81" width="287" height="20"></rect>
    <rect x="44" y="120" width="287" height="106"></rect>
    <rect x="44" y="257" width="287" height="202"></rect>
    <rect x="20" y="478" width="335" height="182"></rect>
  </ContentLoader>
)

export { MyLoader, Facebook, Code, Instagram }
