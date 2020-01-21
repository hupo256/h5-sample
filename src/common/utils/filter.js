// 优惠卷状态
const couponStatus = status => {
  switch (+status) {
  case 1:
    return '未使用'
  case 2:
    return '已使用'
  default:
    return '已失效'
  }
}
// 订单状态
const orderStatus = type => {
  switch (type) {
  case 'DFH':
    return '待发货'
  case 'YQS':
    return '已签收'
  case 'DFK':
    return '待付款'
  case 'YFH':
    return '已发货'
  case 'YQX':
    return '已取消'
  case 'YFK':
    return '已付款'
  }
}
//  样式本状态
const samplingStatus = ['实验室收到样本', '进入实验', 'DNA提取', '基因芯片检测', '检测完成']
// 样本状态3.0
const samplingNewStatus = [
  { name: '绑定', aliasName: '绑定' },
  { name: '回寄中', aliasName: '回寄中' },
  { name: '检测中心收到样本', aliasName: '检测中心收到样本' },
  { name: '样本进入实验', aliasName: '样本进入实验' },
  { name: 'DNA提取', aliasName: 'DNA提取' },
  { name: 'DNA扩增', aliasName: 'DNA扩增' },
  { name: 'DNA杂交', aliasName: 'DNA杂交' },
  { name: '芯片洗染', aliasName: '芯片洗染' },
  { name: '芯片检测', aliasName: '芯片检测' },
  { name: '数据分析', aliasName: '数据分析' },
  { name: '报告生成', aliasName: '报告生成' }]

// 查看报告 需要跳转到调查问券的产品
const investCodeMap = [
  'CAS', 'CNN', 'LAD', 'PGL', 'LAS', 'ACSA', 'ACDA'
]

// 报告首页路由连接
const reportLinkMap = {
  CAS: '/report-cover',
  HPA: '/hpa',
  CNN: '/report-cover',
  CNE: '/cne',
  PGT: '/pgt',
  CHR: '/chr',
  ZTB: '/ztb',
  COT: '/cot',
  CVT: '/cvt',
  CHT: '/report-cover',
  ANF: '/report-cover',
  LAD: '/lad',
  PGL: '/report-cover',
  LAB: '/report-cover',
  CTS: '/report-cover',
  ACSA: '/jimi-report',
  ACDA: '/enjoy-report',
  ACPB: '/preciousmother', // 宝妈呵护
  ACPA: '/pregnantmother' // 孕妈呵护
}

// 报告详情页路由链接
const detailLinkMap = {
  // CAS: '/cas-details',
  ACSA: '/jimi-details',
  ACDA: '/enjoy-details',
  HPA: '/hpa-details',
  // CNN: '/cnn-details',
  // CNE: '/cne-details',
  PGT: '/pgt-details',
  CHR: '/chr-details',
  ZTB: '/ztb-details',
  COT: '/cot-details',
  CVT: '/cvt-details',
  CHT: '/cht-details',
  ANF: '/anf-details',
  LAD: '/lad-details',
  PGL: '/pgl-details',
  LAB: '/lab-details',
  CTS: '/cts-details',
}

// 卡片报告解锁状态
const cardReportStatus = type => {
  switch (+type) {
  case -1:
    return '解锁'
  case 1:
    return '检测中'
  case 2:
    return '报告生成中'
  case 3:
    return '查看报告'
  case 4:
    return '解锁中'
  case 5:
    return '等待解锁'
  }
}

// 民族
const nationMap = [
  {
    label: '汉族',
    value: '汉族'
  },
  {
    label: '壮族',
    value: '壮族'
  },
  {
    label: '满族',
    value: '满族'
  },
  {
    label: '回族',
    value: '回族'
  },
  {
    label: '藏族',
    value: '藏族'
  },
  {
    label: '裕固族',
    value: '裕固族'
  },
  {
    label: '彝族',
    value: '彝族'
  },
  {
    label: '瑶族',
    value: '瑶族'
  },
  {
    label: '锡伯族',
    value: '锡伯族'
  },
  {
    label: '乌孜别克族',
    value: '乌孜别克族'
  },
  {
    label: '维吾尔族',
    value: '维吾尔族'
  },
  {
    label: '佤族',
    value: '佤族'
  },
  {
    label: '土家族',
    value: '土家族'
  },
  {
    label: '土族',
    value: '土族'
  },
  {
    label: '塔塔尔族',
    value: '塔塔尔族'
  },
  {
    label: '塔吉克族',
    value: '塔吉克族'
  },
  {
    label: '水族',
    value: '水族'
  },
  {
    label: '畲族',
    value: '畲族'
  },
  {
    label: '撒拉族',
    value: '撒拉族'
  },
  {
    label: '羌族',
    value: '羌族'
  },
  {
    label: '普米族',
    value: '普米族'
  },
  {
    label: '怒族',
    value: '怒族'
  },
  {
    label: '纳西族',
    value: '纳西族'
  },
  {
    label: '仫佬族',
    value: '仫佬族'
  },
  {
    label: '苗族',
    value: '苗族'
  },
  {
    label: '蒙古族',
    value: '蒙古族'
  },
  {
    label: '门巴族',
    value: '门巴族'
  },
  {
    label: '毛南族',
    value: '毛南族'
  },
  {
    label: '珞巴族',
    value: '珞巴族'
  },
  {
    label: '僳僳族',
    value: '僳僳族'
  },
  {
    label: '黎族',
    value: '黎族'
  },
  {
    label: '拉祜族',
    value: '拉祜族'
  },
  {
    label: '柯尔克孜族',
    value: '柯尔克孜族'
  },
  {
    label: '景颇族',
    value: '景颇族'
  },
  {
    label: '京族',
    value: '京族'
  },
  {
    label: '基诺族',
    value: '基诺族'
  },
  {
    label: '赫哲族',
    value: '赫哲族'
  },
  {
    label: '哈萨克族',
    value: '哈萨克族'
  },
  {
    label: '哈尼族',
    value: '哈尼族'
  },
  {
    label: '仡佬族',
    value: '仡佬族'
  },
  {
    label: '高山族',
    value: '高山族'
  },
  {
    label: '鄂温克族',
    value: '鄂温克族'
  },
  {
    label: '俄罗斯族',
    value: '俄罗斯族'
  },
  {
    label: '鄂伦春族',
    value: '鄂伦春族'
  },
  {
    label: '独龙族',
    value: '独龙族'
  },
  {
    label: '东乡族',
    value: '东乡族'
  },
  {
    label: '侗族',
    value: '侗族'
  },
  {
    label: '德昂族',
    value: '德昂族'
  },
  {
    label: '傣族',
    value: '傣族'
  },
  {
    label: '达斡尔族',
    value: '达斡尔族'
  },
  {
    label: '朝鲜族',
    value: '朝鲜族'
  },
  {
    label: '布依族',
    value: '布依族'
  },
  {
    label: '保安族',
    value: '保安族'
  },
  {
    label: '布朗族',
    value: '布朗族'
  },
  {
    label: '白族',
    value: '白族'
  },
  {
    label: '阿昌族',
    value: '阿昌族'
  }
]

export default {
  couponStatus,
  orderStatus,
  samplingStatus,
  investCodeMap,
  reportLinkMap,
  detailLinkMap,
  cardReportStatus,
  nationMap,
  samplingNewStatus
}
