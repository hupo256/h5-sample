import wxconfig from './wxconfig'

// 分享 wx and app
const toDoShare = (sharePara, isAndall, showMenu=true) => {
  // console.log(sharePara, isAndall)
  // alert('share')
  setTimeout(() => {
    if(isAndall){
      andall.invoke('share', {
        type: 'link',
        url: sharePara.shareUrl,
        title: sharePara.title,
        text: sharePara.subTitle,
        thumbImage: sharePara.headImg,
        image: sharePara.headImg,
      })
    } else {
      wxconfig({
        showMenu,
        params:{
          link: sharePara.shareUrl,
          title: sharePara.title,
          desc: sharePara.subTitle,
          imgUrl: sharePara.headImg,
        }
      })
    }
  }, 200)
}

export default toDoShare
