import ajaxinstance from './ajaxinstance'

const expertCreate = () => {
  const expert = {}
  // 查看全部专家说
  expert.getAllIndexExpertSay = postData => (
    ajaxinstance.post('activIndexExpertSay/getAllIndexExpertSay', postData)
  )
  //专家详情
  expert.getIndexExpertSayDetail = postData => (
    ajaxinstance.post('activIndexExpertSay/getIndexExpertSayDetail', postData)
  )
  //关注专家 
  expert.followExpert = postData => (
    ajaxinstance.post('activIndexExpertSay/followExpert', postData)
  )
  //取消关注专家
  expert.unFollowExpert = postData => (
    ajaxinstance.post('activIndexExpertSay/unFollowExpert', postData)
  )  
  return expert
}

export default expertCreate()
