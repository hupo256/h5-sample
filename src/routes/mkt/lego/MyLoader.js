import React from 'react'
import ContentLoader, {Facebook, Code, Instagram} from 'react-content-loader';

const MyLoader = () => (
  <ContentLoader 
    height={667}
    width={375}
    speed={4}
    primaryColor="#f3f3f3"
    secondaryColor="#ecebeb"
  >
    <rect id="sdf" fill="#FFFFFF" x="0" y="0" width="375" height="603"></rect>
    <rect id="sdfdsf-23" fill="#F1F1F1" opacity="0.900000036" x="15" y="36" width="71" height="14"></rect>
    <rect id="asdfg" fill="#F1F1F1" x="15" y="14" width="103" height="14"></rect>
    <rect id="wer-2" fill="#F1F1F1" opacity="0.900000036" x="44" y="81" width="287" height="20"></rect>
    <rect id="wer-4" fill="#F1F1F1" opacity="0.900000036" x="44" y="120" width="287" height="106"></rect>
    <rect id="wer-5" fill="#F1F1F1" opacity="0.900000036" x="44" y="257" width="287" height="202"></rect>
    <rect id="wer-6" fill="#F1F1F1" opacity="0.900000036" x="20" y="478" width="335" height="182"></rect>
  </ContentLoader>
)

export { MyLoader, Facebook, Code, Instagram}

