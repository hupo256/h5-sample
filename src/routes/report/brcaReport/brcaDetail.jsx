import React from 'react'
import Page from '@src/components/page'
import { fun, ua, API } from '@src/common/app'
import brcaReportApi from '@src/common/api/brcaReportApi'
import images from './images'
import { observer, inject } from 'mobx-react'
import { HpvCardLoader } from '@src/components/contentLoader'
import andall from '@src/common/utils/andall-sdk'
import ResultCard from './components/resultCard'
import ResultOtherCard from './components/resultOtherCard'

import PartCard from './components/partCard'
import AdviseCard from './components/adviseCard'
import EvaluationCard from './components/evaluationCard'
import QuestionCard from './components/questionCard'
import BookCard from './components/bookCard'
import ReviewCard from './components/reviewCard.js'
import NoResultCard from './components/noResultCard.js'
import BannerCard from './components/bannerCard'
import ReadCard from './components/readCard'
import YourOnlyCard from './components/yourOnlyCard'
import ImmunityCard from './components/immunityCard'
import FeedBack from './components/feedbackCard'
import ShareBanner from '../reportShare/components/shareBanner/index.jsx'
import TabConclusion from './components/tabConclusion'
import CardTitle from './components/CardTitle'
import PointsToast from '@src/components/pointsToast'

import styles from './style.scss'
import {  reportBrcaPageView,reportBrcaPageGoto } from './buried-point'
const { getParams } = fun
@inject('hpvReport')
@observer

class report extends React.Component {
  constructor(props) {
    super(props)
  }
  state = {
    isAndall: ua.isAndall(),
    scienceList: [],
    resultList: [],
    tabIndex: 0,
    linkManId:'',
    userName: '',
    userAge:'',
    userId: '',
    headImgType: null,
    haveSubmit: false,
    showTop: false,
    loading: true,
    hideUnlock: false,
    conclusion: '',
    previewPoint:'', // 浏览报告得积分
    QRlist: null,
    posetInfo: null,
    mobile: '',
    loginVisible: false,
    modalFlag:false,
    isAnswer:0, // 0未测评
    qnaireStatus:0, // 0未完成 1已完成
    cepingObj:{},
    productId:'',
    result:{},
    questionList:{
      head:'大家都在问',
      hpvAnswerDtos:[
        {question:`携带BRCA1和BRCA2基因突变是否就意味着我会患癌？`,answer:`不会。但是这两种基因突变会增加一个人患癌的风险。BRCA突变可以让一个人患乳腺癌的风险增高8到10倍；在卵巢癌方面，它让一个人患癌的风险上升至20倍；而在黑色素瘤方面，它致使人患癌的风险会增高2倍 。同样值得注意的是，有些携带BRCA基因突变的人群一生都没有患上癌症，这种情况也同样适用于他们的家族成员`},
        {question:`BRCA突变会让我有患哪些癌症的风险？`,answer:`BRCA1和BRCA2基因突变可让一个人的一生都有患若干种类型癌症的风险。对于女性而言，包括：乳腺癌、卵巢癌、、输卵管癌以及腹膜癌。在这些癌症里，携带BRCA基因突变的女性们最常见的癌症是乳腺癌和卵巢癌`},
        {question:`男性如果携带BRCA突变也会有患癌风险吗？`,answer:`是的。携带BRCA2基因突变的男性也具有更高的患侵袭性前列腺癌及男性乳腺癌的风险。男性乳腺癌(male breast cancer,MBC) 是一种罕见的男性肿瘤,也是乳腺癌中的一种罕见亚型,仅占全部男性肿瘤的0.2%和全部乳腺癌的1%，其易感因素包括乳腺癌家族史、激素水平的变化、BRCA1 (breast cancer 1, early onset) / 2 等基因突变等`},
        {question:`家族中有乳腺相关癌症患者，判断自己为高危人群？`,answer:`1、具有血缘关系的一级或二级亲属中符合（一、自己为乳腺相关癌症患者，判断家人为高危人群的依据）中的任一情形者<br/>2、具有血缘关系的亲属中有BRCA1/BRCA2基因突变的携带者<br/>3、具有血缘关系的三级亲属中有2个乳腺癌患者和（或）卵巢上皮癌、输卵管癌、原发性腹膜癌患者`},
        {question:`如果我的家族里有人曾患有乳腺癌或卵巢癌，且携带了BRCA突变基因，那么我应该注意些什么？`,answer:`除了进行基因检测外，对于女性而言，BRCA基因突变呈阳性，那么建议从25岁起就要接受乳腺癌筛查，如钼靶。之所以这样建议，是因为与普通人群相比，携带BRCA1和BRCA2基因突变的女性有可能会在更早的年龄段里具有更高的患乳腺癌的风险`},
        {question:`女性的乳腺癌或卵巢癌可能遗传自父亲吗？`,answer:`是的。虽然很多人认为，乳腺癌基因缺陷只在家族中的女性成员中传递，但是如果父亲携带这种基因突变的话，那么他的孩子有50%的可能性继承它。而携带乳腺癌基因缺陷的男性，他们自身有10%的可能性会发展为乳腺癌，25%的可能性会发展为前列腺癌`},
        {question:`有哪些方法可以降低患癌风险？`,answer:`有一些风险因素是无法改变的，例如性別、年龄和遗传因素。不过，研究表明，健康低脂的饮食、经常运动、限制饮酒以及不吸烟有望降低患癌风险。对于存在乳腺癌家族史和非典型增生的高危女性，相关临床试验的数据已证实内分泌药物能够有效预防乳腺癌的发生，其能够调节体内雌激素受体的状态从而降低约 30% ～ 50% 的乳腺癌发病危险性。乳腺癌高危女性是否需要进行相关的化学性预防，必须经过专业医生的认真评估之后才能给出合理的决策`},
        {question:`乳腺癌的高危人群有哪些？`,answer:`乳腺癌高危人群一般包括三大类：<br/>
        1、有明显的乳腺癌遗传倾向者（考虑乳腺癌-卵巢癌综合征，推荐行基因检测）；<br/>
        2、既往有乳腺导管或小叶中、重度不典型增生或小叶原位癌患者；<br/>
        3、既往行胸部放疗<br/>
        1、2两类说明女性自己既往得过相关乳腺良性疾病（乳腺导管或小叶不典型增生等等）或者以前因为其他疾病行胸部放疗治疗的病史之一者，发生乳腺癌的风险会明显增加，因此只要属于这两类情形者，均属于乳腺癌高危人群
         30% ～ 50% 的乳腺癌发病危险性。乳腺癌高危女性是否需要进行相关的化学性预防，必须经过专业医生的认真评估之后才能给出合理的决策`},
        {question:`女性带钢圈文胸会导致乳腺癌吗？`,answer:`佩戴文胸、特别是带钢圈的文胸会不会导致乳腺癌，目前相关研究相当少且结果不一致。一项90年代的研究发现，佩戴文胸比不佩戴文胸者乳腺癌发病率高，而且大罩杯比小罩杯高，造成这种差别的其中一个原因可能是肥胖，因为肥胖的人更可能使用大罩杯。2014年来自美国一项设计更科学合理的调查研究发现，佩戴文胸时间长短、尺寸大小、有无钢圈和年龄大小等因素，都和乳腺癌没有任何关系。建议文胸还是需要佩戴的，特别是在走路、运动的时候，对乳腺还是有保护作用的。但在家休闲、特别是睡觉时，就没有必要再佩戴了，给乳房一个放风自由活动的时间和机会，可以让乳房更加健康和美丽`},
        {question:`按摩对治疗乳腺癌有帮助吗？`,answer:`对于发生于乳腺的恶性肿瘤，按摩是禁忌<br/>
        一般的体检要求检查者指腹以轻轻滑动的方式触摸肿块，防止因过度挤压导致癌细胞扩散。非专业的按摩人员如果挤压严重，会存在促使肿瘤细胞扩散的可能。对于常见乳腺疾病来说，按摩一丁点作用都没得，并且对乳腺癌来说，还会加速血液循环，使癌细胞获取更多营养，导致癌细胞扩散
        `},
        {question:`乳腺增生会变乳腺癌吗？`,answer:`乳腺增生是最常见的良性乳腺疾病，包括三种类型的病变：<br/>
        非增生性病变包括囊肿、大汗腺化生、纤维腺瘤、导管扩张，乳腺炎、轻度的普通型增生等。此类患者患乳腺癌的风险并不高于一般女性。如果有乳腺癌家族史，其发生乳腺癌的风险将增加<br/>
        不伴有非典型性的增生性病变包括普通型导管增生、导管内乳头状瘤、导管内乳头状瘤硬化性腺病和放射性瘢痕。这类患者患乳腺癌的风险是一般人群的1.5～2倍<br/>
        非典型性增生是乳腺的增生性病变，分为非典型导管增生和非典型性小叶增生。这类患者患乳腺癌的风险约是一般人群的3.5～5倍<br/>
        多数乳腺增生不需要治疗。定期随诊是及早发现乳腺癌的关键，建议每半年至1年复查1次。如果疼痛明显或影响生活、工作，医生一般会给予对症治疗，但治疗很难使乳腺组织的改变复原。如果疼痛不适非常明显、影响生活工作睡眠，除改善生活方式外，还可能要服用药物甚至进行手术。需要指出，中草药外敷、按摩、理疗等方法基本无效，尤其是一些非正规的诊断及治疗，容易延误诊治        
        `},
    
      ]
    },
    referecence:{
      title:'参考文献',
      text:`Merck Manual of Diagnosis and Therapy. Breast Disorders: Breast Cancer. February 2003 [5 February 2008]. <br/>
      Clarke VA,Savagre SA.Breast self- examination training:a brief review[J].Cancer Nurs,1999,22(4):320-325.<br/>
      （美）John E.Niederhuber,（美）James O.Armitage,（美）James H.Doroshow,（美）Michael B.Kastan,（美）Joel E.Tepper原著者；孙燕主译.临床肿瘤学第5版下卷[M].北京：人民军医出版社，2016.9，1820~1892<br/>
      中国抗癌协会乳腺癌专业委员会，中国抗癌协会乳腺癌诊治指南与规范(2015版)[J]中国癌症杂志.2015，（25）9，692~754<br/>
      Privat M, Aubel C, Arnould S, et al. AKT and p21 WAF1 / CIP1 as potential genistein targets in BRCA1-mutant human breast cancer cell lines [ J]. Anticancer Res,2010,30 ( 6 ): 2049-2054
      李波,华彬. 乳腺癌 BARD1 基因研究的现状[J/ CD]. 中华 乳腺病杂志:电子版, 2010,4(5): 554-557<br/>
      Diamond JR, Borges VF, Eckhardt SG, et al. BRCA in breast cancer: from risk assessment to therapeutic prediction [ J ]. Drug News Perspect, 2009, 22(10): 603-8<br>
      Ferlay J，Soerjomataram I，Dikshit R，et a1．Cancer incidence and mortality
      worldwide：sources，methods and major patterns in GLOBOCAN 2012．[J]．Int J
      Cancer．20 1 5，1 36(5)：E359-286<br/>
      Morris JR，Boutell C，Keppler M，et al. The SUMO modification pathway is
      involved in the BRCA1 response to genotoxic  stress [J]．Nature，2009，462(7275)：
      886．890<br/>
      De Siervi A，De Luca P，Byun JS，et al．Transcriptional autoregulation by
      BRCA1[J]．Cancer Res，2010，70(2)：532-542`
    },
    id: 0,
    infoOne:[{
      title:'乳房或腋窝有肿块或组织增厚',
      para:'乳腺癌最早期的症状是硬块，触感和周围组织不一样。超过八成乳腺癌的发现原因，是女性自己发现的肿块。腋下淋巴结上的硬块，也是乳腺癌的征兆',
      img:`${images.symptomOne}`,
      isShow: false
      },
      {
        title:'胸部皮肤橘皮样改变',
        para:'当乳腺癌来临时，人体的胸部皮肤会出现很多明显的体征变化，主要是因为肿瘤侵犯了周围的组织，导致皮肤凹陷的情况出现。等到癌细胞将淋巴管堵塞时，胸部的皮肤更会出现橘皮样的改变，即像橘子皮一样，出现很多小点状的凹陷',
        img:`${images.symptomTwo}`,
        isShow: false
      },
      {
        title:'乳头流出脓状或血样液体',
        para:`乳头流出脓状或血样液体，乳头溢液有时是早期乳腺癌的唯一症状，特别是血性溢液、咖啡色溢液、黄色溢液，千万不能掉以轻心`,
        img:`${images.symptomThree}`,
        isShow: false
      },
      {
        title:'乳头和乳晕异常',
        para:`如果乳腺癌位于或接近乳头的深处，就会引起乳头回缩，如果离的较远，就有可能出现抬高或回缩情况，还可能表现为皮肤瘙痒或糜烂等。不要小看这些症状表现，都有可能是乳腺癌的症状`,
        img:`${images.symptomFour}`,
        isShow: false
      }, 
      {
        title:'乳房或乳房周围的皮肤刺激过敏',
        para:`症状会包括发麻、发痒、越来越敏感、灼热感和疼痛等`,
        img:`${images.symptomFive}`,
        isShow: false
      }
    ],
    infoTwo:[{
        isShow: false,
        title:'不明原因的腹胀',
        para:'女性腹胀、稍食即饱症状比较常见，许多人不以为然，但它有可能是卵巢癌发生最早期的症状。卵巢癌患者因肿瘤压迫，在腹腔内牵扩周围韧带引起，再加上腹水的发生，使患者出现腹胀感，不会因经期或服用药物而减轻，是最重要的提示信号',
      },
      {
        isShow: false,
        title:'尿频、尿急、有尿意无尿',
        para:'在摄入水分变化不大的情况下尿频、尿急，常有强烈的尿意但是无尿。以上症状易被诊断为尿路感染。卵巢癌发生时，肿块刺激尿路也可出现上述症状。尿路感染在给予对症抗感染治疗之后症状多可缓解，卵巢癌所致尿频、尿急、有尿意无尿则对抗感染治疗无效',
      },
      {
        isShow: false,
        title:'原因不明的消瘦',
        para:`在没有节食和（或）加大运动量的情况下，体重在一个月内减轻超过4.5公斤。甲亢是女性常见病，会使体重下降，但要留意消瘦也可能是卵巢癌所致`,
      },
      {
        isShow: false,
        title:'月经少或闭经',
        para:`多数卵巢癌患者无月经的变化。若卵巢正常组织均被癌细胞破坏，患者浑身状态欠佳，可出现月经过少或闭经`,
      }, 
      {
        isShow: false,
        title:'盆腔疼痛',
        para:`女性在经前期和排卵期常可出现生理性盆腔痛，若盆腔痛的发生无规律性，表现与经期无联系时，那么无论原因是什么，都是需要引起关注的异常情况。便秘、胀气、肠易激综合征等也可出现盆腔痛，但疼痛程度较轻。卵巢癌导致的盆腔痛类似痛经甚至更严重，一般患者需要卧床休息，并需服用止痛药以缓解症状`,
      },
      {
        isShow: false,
        title:'腹痛、腰痛',
        para:`卵巢癌浸润周围组织，或者与邻近组织发生粘连，压迫神经可造成腹痛、腰痛，其性质由隐隐作痛到钝痛，甚至较剧烈的疼痛`,
      },
      {
        isShow: false,
        title:'下肢及外阴水肿',
        para:`如果在没有尿量减少、心功能减退等病因情况下出现下肢及外阴水肿，需要引起注意，警惕卵巢癌的发生。卵巢癌在盆腔内长大固定，压迫盆腔静脉，或致淋巴回流受阻，时间久了就可能会导致下肢及外阴的水肿`,
      }
    ],
    infoThree:[{
      isShow: false,
      title:'肿瘤标志物检查',
      para:'CA125、人附睾蛋白4（HE4）、CA199和CEA，AFP、HCG、性激素，特别是基于CA125和HE4检测的卵巢癌风险预测值对鉴别盆腔肿物的良恶性有帮助',
    },
    {
      isShow: false,
      title:'超声检查',
      para:'对于盆腔肿块的检测有重要意义，可描述肿物的大小、部位、质地等',
    },
    {
      isShow: false,
      title:'盆腔、腹部CT及MRI',
      para:`对判断卵巢周围脏器的浸润、有无淋巴转移、有无肝脾转移及指导制订治疗方案及估计预后`,
    },
    {
      isShow: false,
      title:'胸部、腹部X线检查',
      para:`对判断有无胸腔积液、肺转移和肠梗阻有诊断意义`,
    }, 
    {
      isShow: false,
      title:'脱落细胞学检查',
      para:`一般从三方面获取脱落细胞标本，包括：<br/>① 阴道、颈管及宫腔；<br/>② 腹水或腹腔灌洗液；<br/>③ 子宫直肠陷凹穿刺吸取`,
    },
    {
      isShow: false,
      title:'细针穿刺吸取法检查',
      para:`高度怀疑为卵巢癌、盆腔炎性肿块或盆腔子宫内膜异位症，而在鉴别诊断上有困难者，可经阴道、直肠、腹部进行穿刺吸取细胞检查，并可从浅表淋巴结如锁骨上、腹股沟淋巴结获取细胞检查。检查腹膜后淋巴结，则可借荧光透视、B超或CT扫描来指导穿刺部位，以提高穿刺吸取检查的准确性`,
    },
    {
      isShow: false,
      title:'腹腔镜检查',
      para:`能在直视下观察盆腔的病理变化、范围，并作活检。病理切片检查通过剖腹探查手术，取得病理组织，在显微镜下进行观察分析`,
    }
    ],
    infoFour:[{
      isShow: false,
      title:'饮食均衡，限制脂肪摄入',
      para:`俗话说“病从口入”，大量研究均证实，饮食偏好脂肪类食物的人群发生卵巢癌的<br/>风险更高，同时维生素、纤维素缺乏也是患卵巢癌的危险因素之一。因此广大女性一定要注意，在日常饮食中一定要注意多吃蔬菜、水果，少吃烤肉、油炸食品以及奶油制品，尽量减少脂肪类食物的摄入量`,
      },
      {
        isShow: false,
        title:'健康生活，合理使用激素',
        para:'由于不注意保暖，喜食冷饮，所以很多女性都存在痛经、月经失调的问题，也经常通过激素类药物来调节月经。这类药物不仅能帮助女性调节身体代谢，还能帮助女性维持美貌和体态。但女性同胞们要注意，服用此类药物一定要听从医生的建议，不要将它当作保持青春的“灵丹妙药”，也不要自行服用含有激素的保健品、补品，否则很可能会增加患卵巢癌的风险',
      },
      {
        isShow: false,
        title:'适当运动，保持身体健康',
        para:`现代职业女性大多存在“久坐不动”的问题，同时由于工作繁忙，即使是在节假日也不想外出只想宅在家里。久而久之，不仅肥胖会找上门来，各种疾病也会不约而至。在这里我们要奉劝广大女性同胞，要想身体健康，一定要“迈开腿”。天气良好时外出活动一下身体，也可每天抽出一些时间做做瑜伽或者保健操，不仅能提高身体的免疫力，也能保持心情舒畅。当然也要注意运动贵在坚持，切不可半途而废`,
      },
      {
        isShow: false,
        title:'定期筛查，养成良好的生活习惯',
        para:`为进一步降低卵巢癌的发生风险，我们建议女性应戒烟酒，养成良好的生活习惯，保持良好的心情。也应尽量居住在环境相对好的社区，避免接触石棉、滑石粉等有害物质。同时每年至少接受一次妇科检查，特别是 50 岁以上的女性应每年进行一次阴道超声检查联合血清检测`,
      }, 
      {
        isShow: false,
        title:'适当饮茶，拒绝色素饮品',
        para:`随着人们生活水平的提高，新品种的饮料也越来越多，这些饮料五颜六色十分吸引人，所以很多女性在逛街时都习惯买上一杯。这些饮品中不仅包含着大量的糖分，色素含量也高的吓人。大量研究均已证实，长期饮用色素饮料，会引发内分泌失调，极易诱发多种女性疾病。所以女性同胞们一定不要被色素饮品的漂亮外表所迷惑，平时可适当喝些茶，不管是红茶还是绿茶，都好过色素饮料`,
      }
    ],
    infoSix:[{
      isShow: false,
      title:'加强监测，定期进行乳腺癌筛查',
      para:`乳腺癌筛查是对无症状人群进行癌症筛查，以期早发现、早诊断、早治疗，对于早期乳腺癌的治疗有希望进行保乳手术，同时将明显改善5年生存率`,
      },
      {
        isShow: false,
        title:'行为调整',
        para:`生活方式的调整在预防乳腺癌的发生中至关重要，比如：肥胖、高脂肪饮食、饮酒、缺乏锻炼等，不良生活方式将增加患乳腺癌的风险。因此，改进生活方式最终可能会改变一个女人患乳腺癌的风险
        <br/>2008年《柳叶刀》上的一篇文章指出：亚洲女性体重的增长与乳腺癌的发生之间有很强的关联性。并且越来越多的研究表明，肥胖与乳腺癌的发生率及死亡率的上升有直接关系。早有研究证实，每天运动30～40分钟，可以使乳腺癌的发生率降低37%。如果同时控制饮食，尤其是减少脂肪类食物的摄入量，无论是对于健康女性而言，还是对乳腺癌患者而言，都有积极意义
        `,
      },
      {
        isShow: false,
        title:'药物预防',
        para:`目前已证实口服乳腺癌内分泌治疗的药物（比如：他莫昔芬、雷洛昔芬、依西美坦等），但是这些药物也有一定的副作用，有的也是会带来其他癌症。因此，在服药之前，需要认真评估权衡利弊`,
      },
      {
        isShow: false,
        title:'进行预防性乳腺切除术，即卵巢切除术',
        para:`预防性乳腺切除术或卵巢切除术是有争议的具有预防乳腺癌的方法。切除绝经前女性的卵巢可以很大程度上减少女性自身产生的雌激素，还可能停止或减慢依赖于雌激素的乳腺癌的生长，但是对女性的内心打击是巨大的，需要我们慎重选择`,
      }
    ],
    coupon:{},
    banner:{},
    testing:{},
    data:{},
    isHide:false,//分享是否隐藏测评
    isShowOne:false,
    isShowTwo:false,
    isShowThree:false,
    isShowFour:false
  }

  componentDidMount() {
    const { isPreviewFlag, code, expirationDateTime, id, priviewTraitConclusion, traitId ,shareToken} = getParams()
    if (isPreviewFlag === 'true') {
      // 报告预览
      const params = {
        code,
        expirationDateTime: decodeURIComponent(expirationDateTime),
        id: +id,
        priviewTraitConclusion: decodeURIComponent(priviewTraitConclusion),
        traitId: +traitId
      }
      this.handleQueryReportDetail(params)
      function onBridgeReady() {
        WeixinJSBridge.call('hideOptionMenu')
      }
      if (typeof WeixinJSBridge === 'undefined') {
        if (document.addEventListener) {
          document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false)
        } else if (document.attachEvent) {
          document.attachEvent('WeixinJSBridgeReady', onBridgeReady)
          document.attachEvent('onWeixinJSBridgeReady', onBridgeReady)
        }
      } else {
        onBridgeReady()
      }
    } else {
      this.getBrcaDetail()
      // this.versionCtrl()
      // this.getUserInfor()
      this.listenTab()
      this.listenScroll()
    }
    reportBrcaPageView()
    this.setState({
      isHide:shareToken?true:false
    })

  }
  handleQueryReportDetail = (params) => {
    API.previewRestructureReportDetail(params).then(res => {
      this.pageInit(res)
    })
    const { user: { getLastUserLindManId } } = this.props
    getLastUserLindManId()
  }
  toggleMask = (name) => {
    const bool = this.state[name]
    this.setState({
      [name]: !bool
    })
  }
  changeMobile = (num) => {
    this.setState({
      mobile: num
    })
  }
  // 设置登陆标示
  setLoginFlag = bool => {

  }

  // 获取页面详情配置
  getBrcaDetail = () => {
    const obj = getParams()
    this.setState({
      tabIndex: getParams().closeWebViewFlag ? 1 : 0
    })

    brcaReportApi.getBRCADetail({
      ...obj,
    }).then(res => {
      this.pageInit(res)
    })
  
  }
  // 获取用户信息
  getUserInfor = () => {
    const infoPara = { noloading: 1 }
    ua.isAndall() && Object.assign(infoPara, { clientType: 'app' })
    API.myInfo(infoPara).then(res => {
      // console.log(res)
      const { code, data } = res
      if (!code) this.setState({ ...res.data })
      if (!data.mobileNo) {
        this.setState({
          loginVisible: true
        })
      }
    })
  }
  // 根据版本控制推荐模块
  versionCtrl = () => {
    let version = andall.info.version || '1.6.0'
    // console.log(version.split('.').join(''));
    const versionStr = version.split('.').join('')
    if (versionStr < 165) {
      this.setState({
        hideUnlock: true
      })
    }
  }
  // 页面初始化
  pageInit = (res) => {
    const { isAndall, resultList, scienceList} = this.state
    if (res.data) {
      // console.log(res.data.conclusionList.filter(item => item.moduleType === 4511))
      // let _arr = res.data.scienceList.filter(item => item.moduleType === 4514)
      // localStorage.setItem('linkManId', res.data.linkManId)
      // localStorage.setItem('productCode', res.data.code)
      // localStorage.setItem('userName', res.data.userName)
      // localStorage.setItem('userAge', res.data.age)
      // localStorage.setItem('reprotResult', res.data.conclusionList ? res.data.conclusionList.filter(item => item.moduleType === 4511)[0].data.result : '')
      res.data.conclusionList.map(item => {
        if (item.moduleType == 4508) {
          this.setState({
            coupon:item.data
          })
        }
        if (item.moduleType == 1102) {
          this.setState({
            banner:item
          })
        }
      })
      res.data.scienceList.map(item => {
    
        if (item.moduleType == 4522) {
          
          this.setState({
            testing:item,
            isAnswer:item.data.haveAdvices==1?999:0
          })
        }
      })
      this.setState({
        // ...res.data,
        // linkManId:res.data.linkManId,
        // previewPoint:res.data.pointStatusTipResp ? res.data.pointStatusTipResp.point : '',
        // productCode:res.data.code,
        // QRlist: res.data.reportQrcodeConfigReqList,
        // userName: isAndall ? res.data.userName : this.desensitization(res.data.userName, 0, -1),
        data:res.data,
        resultList:res.data.conclusionList,
        scienceList:res.data.scienceList,
        // isAnswer:_arr.length ? _arr[0].data.isAnswer : 999,
        // qnaireStatus:_arr.length ? 0 : 1,
        // cepingObj:_arr.length ? _arr[0].data : {},
        loading: false,
      })

      // res.data.conclusionList.map(item => {
      //   if (item.moduleType == 4508) {
      //     this.setState({
      //       coupon:item.data
      //     })
      //   }
      // })

    
      // 结果页埋点
      
      !isAndall && reportBrcaPageGoto({viewtype:'share'})
    }
    if (isAndall) {
      andall.invoke('setReportDetailData', { res }, res => {
      })
      if (getParams().questionFinished) {
        this.setState({ tabIndex:1 })
        andall.invoke('changeReportTab', { index: 1 })
        // this.state.scienceList.filter(item => item.moduleType === 4518)[0].data.hpvAdviceDtos.map((item, index) => {
        //   if (document.getElementById(`list${index + 1}`).clientHeight > 440) {
        //     item.showMoreFlag = true
        //   }
        // })
      }
    }
  }
  // 脱敏方法
  desensitization = (str, beginLen, endLen) => {
    const len = str.length === 1 ? 2 : str.length
    const firstStr = str.substr(0, beginLen)
    const lastStr = str.substr(endLen)
    const middleStr = str.substring(beginLen, len - Math.abs(endLen)).replace(/[\s\S]/ig, '*')
    const tempStr = firstStr + middleStr + lastStr
    return tempStr
  }
  // 监听app原声导航条
  listenTab = () => {
    andall.on('reportDetailChangeIndex', res => {
      const { index } = res
      const { tabIndex, scienceList, isAndall } = this.state
      this.setState({
        tabIndex: index
      }, () => {
        // if (index === 1 && scienceList.filter(item => item.moduleType === 4518).length) {
        //   scienceList.filter(item => item.moduleType === 4518)[0].data.hpvAdviceDtos.map((item, index) => {
        //     if (document.getElementById(`list${index + 1}`).clientHeight > 440) {
        //       item.showMoreFlag = true
        //     }
        //   })
        // }
        if (this.state.tabIndex !== index) {
          document.documentElement.scrollTop
            ? document.documentElement.scrollTop = 0
            : document.body.scrollTop = 0
        }
        // 检测结果
        if (index === 0) {
          reportBrcaPageGoto({viewtype:'detail_result'})
          document.body.scrollTop = document.documentElement.scrollTop = 0;
        }
        // 专家建议
        if (index === 1) {
          reportBrcaPageGoto({viewtype:'expertise'})
          document.body.scrollTop = document.documentElement.scrollTop = 0;
         
        }
      })
    })
  }
  // 导航条切换
  reportDetailChangeIndex = index => {
    const { scienceList, isAndall, tabIndex } = this.state
    this.setState({
      tabIndex: index
    }, () => {
      // if (index === 1 && scienceList.filter(item => item.moduleType === 4518).length) {
      //   scienceList.filter(item => item.moduleType === 4518)[0].data.hpvAdviceDtos.map((item, index) => {
      //     if (document.getElementById(`list${index + 1}`).clientHeight > 440) {
      //       item.showMoreFlag = true
      //     }
      //   })
      // }
      !isAndall && reportBrcaPageGoto({viewtype:'share'})
    })
  }
  // 提交反馈控制
  handleSubmit = () => {
    if (getParams().shareToken) {
      return
    }
    this.setState({
      haveSubmit: true,
    })
  }
  // 返回顶部
  backTop = () => {
    // document.getElementById('top').scrollIntoView({
    //   behavior: 'smooth',
    //   block: 'start'
    // })

    // window.scrollTo({ top:0, behavior:'smooth' })

    //smoothscroll.polyfill();

    //window.scroll({ top: 0, behavior: 'smooth' });
    this.scroll();
  }

  scroll = (ev, target) => {
    //ev.preventDefault();

    const endPositionY = window.pageYOffset;

    const startTime = +new Date();
    const duration = 500; //ms

    function run() {
        const time = +new Date() - startTime;

        window.scrollTo(0, endPositionY * (1-(time / duration)));
        run.timer = requestAnimationFrame(run);

        if (time >= duration) {
            window.scrollTo(0, 0);
            cancelAnimationFrame(run.timer);
        }
    } 

    requestAnimationFrame(run);
}

  // 监听滑动
  listenScroll = () => {
    document.body.onscroll = e => {
      if (e.target.documentElement.scrollTop) {
        if (e.target.documentElement.scrollTop > 667) {
          this.setState({
            showTop: true
          })
        } else {
          this.setState({
            showTop: false
          })
        }
      } else {
        if (e.target.body.scrollTop > 667) {
          this.setState({
            showTop: true
          })
        } else {
          this.setState({
            showTop: false
          })
        }
      }
    }
  }
  // 传递结论
  handleConclusion = (conclusion) => {
    this.setState({
      conclusion
    })
  }
  handleDetail=(array)=>{
    // console.log(array)
    // let dataConfig = { ...dataConfig, array }
    // this.props.history.push({
    //   pathname: `/brcaReport/moreBrcaDetail`,
    //    state: { dataConfig }
    // })
    let url = `${window.location.origin}/mkt/brcaReport/moreBrcaDetail?barCode=${getParams().barCode}`  
    if (ua.isAndall()) {
      location.href = `andall://andall.com/inner_webview?url=${url}`
    } else {
      location.href = url
    }
  }

  handleTab=(id)=>{
    if(id==0){
      reportBrcaPageGoto({viewtype:'breast_cancer'})
    }
    else{
      reportBrcaPageGoto({viewtype:'oophoroma'})
    }
    this.setState({ 
      id
    })
  }
  changeDrawItem=(e,type)=>{
    let {infoOne,infoTwo,infoThree,infoFour,infoSix}=this.state
    if(type=='infoOne'){
      infoOne[e].isShow = infoOne[e].isShow ? false : true
      this.setState({
        infoOne
      })   
    }
    else if(type=='infoTwo'){
      infoTwo[e].isShow = infoTwo[e].isShow ? false : true
      this.setState({
        infoTwo
      })    
    }
    else if(type=='infoThree'){
      infoThree[e].isShow = infoThree[e].isShow ? false : true
      this.setState({
        infoThree
      }) 
    }
    else if(type=='infoFour'){
      infoFour[e].isShow = infoFour[e].isShow ? false : true
      this.setState({
        infoFour
      }) 
    }
    else if(type=='infoFive'){
      if(e==0){
       this.setState({
         isShowOne:!this.state.isShowOne
       })
      }
      else if(e==1){
        this.setState({
          isShowTwo:!this.state.isShowTwo
        })
      }
      else if(e==2){
        this.setState({
          isShowThree:!this.state.isShowThree
        })
      }
      else if(e==3){
        this.setState({
          isShowFour:!this.state.isShowFour
        })
      }
    }
    else if(type=='infoSix'){
      infoSix[e].isShow = infoSix[e].isShow ? false : true
      this.setState({
        infoSix
      }) 
    }
    
    
  }
  reviewLink=(obj)=>{
    let url = `${window.location.origin}/mkt/questionnaire/basequestion-new?qnaireCode=${obj.qnaCode}&linkManId=${obj.linkManId}&barCode=${getParams().barCode}&brcaReport=1`  
    if (ua.isAndall()) {
      location.href = `andall://andall.com/inner_webview?url=${url}`
    } else {
      location.href = url
    }
  }

  render() {
    const { hpvReport: { data:{ noscroll } } } = this.props
    const { tabIndex, scienceList, resultList,
      userName, userId, headImgType, haveSubmit,
      isAndall, showTop, loading, isAnswer, QRlist, productId, isLatestReport ,
      result,questionList,referecence,id,infoOne,infoTwo,infoThree,infoFour,infoSix,coupon,banner,testing,data,isHide,isShowOne,isShowTwo,isShowThree,isShowFour} = this.state
    const { isPreviewFlag } = getParams()
    return (
      <Page title='报告详情'>
        <div id='top'>
          {
            this.state.previewPoint ? <PointsToast value={this.state.previewPoint} /> : ''
          }
          {
            !isAndall && <div className={styles.tabs}>
              <div onClick={() => this.reportDetailChangeIndex(0)}>
                <div className={styles.title}
                  style={!tabIndex ? { color: '#6567E5' } : null}>检测结果</div>
                <div className={!tabIndex ? styles.underline : null} />
              </div>
              <div onClick={() => this.reportDetailChangeIndex(1)}>
                <div className={styles.title}
                  style={tabIndex ? { color: '#6567E5' } : null}>专家解读
                </div>
                <div className={tabIndex ? styles.underline : null} />
              </div>
            </div>
          }
          {
            loading ? <HpvCardLoader /> : (
              <div className={`${styles.hpvReport} ${noscroll && styles.noscroll}`}>
                {/* <div className={`${styles.hpvReport} ${noscroll && styles.noscroll}`}> */}
                <div style={!tabIndex ? null : { display: 'none' }}>
                  {
                    resultList.length ? resultList.map((item, index) => {
                      switch (item.moduleType) {
                      case 4521:
                      // 检测结果
                        return <ResultOtherCard data={item.data} userName={data.userName} handleDetail={this.handleDetail} />
                      // case 4512:
                      // // 分型结果
                      //   return <PartCard key={index} data={item.data} />
                      // case 4513:
                      // // 就医建议
                      //   return <AdviseCard key={index} data={item.data} />
                      // case 4514:
                      // // 专业测评
                      //   return <EvaluationCard key={index} data={item.data} />
                      // case 4515:
                      // // 大家都在问
                      //   return <QuestionCard key={index} data={item.data} hasIcon={true} />
                      // case 4516:
                      // // 定期复查
                      //   return <ReviewCard key={index} data={item.data} productId={productId} />
                      // case 3201:
                      // // 科学文献
                      //   return <BookCard key={index} data={item.data} />
                      }
                    }) : ''
                  }
                 {isAnswer!==999 ? 
                  <EvaluationCard data={testing.data} />:
                  null
                 }
                  <QuestionCard data={questionList} hasIcon={true} />
                  {JSON.stringify(coupon) !== "{}"?<ReviewCard data={coupon} productId={data.productId}/>:null}
                  {JSON.stringify(banner) !== "{}"?<BannerCard data={banner}/>:null}
                  <BookCard data={referecence} />
                  <div className={styles.whiteBlock} />
                </div>
                <div className={styles.suggestPanel} style={!tabIndex ? { display: 'none' } : null}>
                  {/* 专家解读 */}
                  {isAnswer !== 999 ? <NoResultCard cepingObj={testing.data} />
                    : <div>{scienceList.length && scienceList.map((item, index) => {
                      switch (item.moduleType) {
                      // case 4517:
                      // // 测评结果
                      //   return <ReadCard key={index} userName={userName} data={item.data} />
                      // case 4518:
                      // // 专家建议
                      //   return <YourOnlyCard key={index} data={item.data} isLatestReport={isLatestReport} />
                      // case 3201:
                      // // 专家建议
                      //   return <ImmunityCard key={index} data={item.data} />
                      // case 4203:
                      // // 反馈
                      //   return <FeedBack
                      //     key={index}
                      //     data={item.data}
                      //     userId={userId}
                      //     haveSubmit={haveSubmit}
                      //     handleSubmit={this.handleSubmit} />
                      case 4522:
                        return <TabConclusion tabIndex={id} data={item.data} handleTab={this.handleTab}/>  
                      }
                      
                    })}
                      <div className={styles.conclusion}>
                        {id==0?
                          <div className={styles.conclusionPart}>
                            <div className={styles.conclusionBlock}>
                              <CardTitle title='典型症状' />
                              <div className={styles.drawBlock}>
                                {infoOne.map((item,index)=>{
                                    return (
                                      <div className={`${styles.drawItem} ${!!item.isShow?`${styles.active}`:''}`} onClick={()=>{this.changeDrawItem(index,'infoOne')}}>
                                        <div className={styles.drawTitle}>
                                          <h1>{item.title}</h1>
                                          <i className={styles.arrow}></i>
                                        </div>
                                        <div className={styles.drawHidePart}>
                                          <div className={styles.drawImg}>
                                            <img src={item.img} />
                                          </div>  
                                          <div className={styles.drawParaCon}>
                                          <p dangerouslySetInnerHTML={{ __html:item.para }}></p>
                                          </div>        
                                        </div>    
                                      </div>  
                                    )

                                  })
                                }
                              </div>
                            </div>

                            <div className={styles.conclusionBlock}>
                              <CardTitle title='如何检查' />
                              <div className={`${styles.drawBlock} ${styles.noImg}`}>
                                <div className={styles.drawBlockPara}>不论有无家族史和致病性的基因突变，所有女性都有患癌风险。做好筛查有助于及时发现癌症，并进行治疗。早期治疗，乳腺癌是有治愈可能的</div>
                                <div className={styles.line}></div>
                                <div className={styles.tipsOne}>
                                  <h1>乳房自我检查</h1>
                                  <p>近40年来，乳房自我检查成为早期诊断乳腺癌的重要方法之一</p>
                                </div>  
                                
                                <div className={`${styles.drawItem} ${!!isShowOne?`${styles.active}`:''}`} onClick={()=>{this.changeDrawItem(0,'infoFive')}}>
                                  <div className={styles.drawTitle}>
                                    <h1><em>01.</em><span>站在镜子前，以三个不同的姿势观察你的乳房</span></h1>
                                    <i className={styles.arrow}></i>
                                  </div>
                                  <div className={styles.drawHidePart}>
                                    <div className={styles.drawParaCon}>
                                      <img src={images.picOne} />
                                      <img src={images.picTwo} />
                                    </div>        
                                  </div>    
                                </div> 
                                <div className={`${styles.drawItem} ${!!isShowTwo?`${styles.active}`:''}`} onClick={()=>{this.changeDrawItem(1,'infoFive')}}>
                                  <div className={styles.drawTitle}>
                                    <h1><em>02.</em><span>淋浴时身体抹上香皂，再做以下的检查</span></h1>
                                    <i className={styles.arrow}></i>
                                  </div>
                                  <div className={styles.drawHidePart}>
                                    <div className={styles.drawParaCon}>
                                      <p>1.举起右侧手臂，用左手的三只或四只手指并拢，从右胸外缘开始按压。手指以稳定的压力，依环状滑动，直到最内圈的乳头。要确定整个乳房已经地毯式摸过而无遗漏</p>
                                      <div className={styles.imgBlock}>
                                        <img src={images.stepOne} className={styles.imgItem} />
                                        <img src={images.stepTwo} className={styles.imgItem} />
                                      </div> 
                                      <p>2.再来用同样的方式，检查乳房和腋窝之间的区域，以及腋窝本身。有没有摸到任何皮下的硬块？再轻轻挤压乳头，有分泌物吗？整个完成后，换成左手举高，用右手检查左边乳房</p>
                                      <div className={styles.imgBlock}>
                                        <img src={images.stepThree} className={styles.imgItem} />
                                        <img src={images.stepFour} className={styles.imgItem} />
                                      </div> 
                                    </div>        
                                  </div>    
                                </div>
                                <div className={`${styles.drawItem} ${!!isShowThree?`${styles.active}`:''}`}>
                                  <div className={styles.drawTitle}>
                                    <h1><em>03.</em><span>走出淋浴间，擦干身体，仰身躺下，重复第2部分的检查</span></h1>
                                    {/* <i className={styles.arrow}></i> */}
                                  </div>
                                  {/* <div className={styles.drawHidePart}>
                                    <div className={styles.drawParaCon}>
                                      <p>注意：检查乳房的最好时间是月经过后一星期之内，此时血液中的荷尔蒙成分已降低，乳房比较不会一触即痛。<br/>子宫切除但卵巢仍在的女性可能会发现，每个月固定时候，乳房仍会触痛，那么仍必须定期在乳房没那么痛时做乳房自我检查。停经期或停经后女性每个月也必须挑一、两天来做自我检查。把日期定在日历手册中，在边上贴上提醒的纸条，以加强这个新习惯。但是，若是有一个月忘记了，不要放弃，下个月再开始</p>
                                      
                                    </div>        
                                  </div>     */}
                                </div> 
                                <div className={`${styles.drawItem} ${!!isShowFour?`${styles.active}`:''}`} onClick={()=>{this.changeDrawItem(3,'infoFive')}}>
                                  <div className={styles.drawTitle}>
                                    <h1><i></i><span className={styles.pink}>注意事项</span></h1>
                                    <i className={styles.arrow}></i>
                                  </div>
                                  <div className={styles.drawHidePart}>
                                    <div className={styles.drawParaCon}>
                                      <p className={styles.pink}>检查乳房的最好时间是月经过后一星期之内，此时血液中的荷尔蒙成分已降低，乳房比较不会一触即痛。<br/>子宫切除但卵巢仍在的女性可能会发现，每个月固定时候，乳房仍会触痛，那么仍必须定期在乳房没那么痛时做乳房自我检查。停经期或停经后女性每个月也必须挑一、两天来做自我检查。把日期定在日历手册中，在边上贴上提醒的纸条，以加强这个新习惯。但是，若是有一个月忘记了，不要放弃，下个月再开始</p>
                                    </div>        
                                  </div>    
                                </div>  
                                
                                <div className={styles.line}></div>
                                <div className={styles.tipsOne}>
                                  <h1>定期前往医院进行相关检查</h1>
                                  <p>乳房自检虽然能够早期发现乳房的异常，但并不是早期发现乳腺癌的最好办法，关于自检，你只能做到发现异常，尽早到医院就诊，做进一步的检查确诊。美国癌症协会建议：</p>
                                  <div className={styles.tipParaCon}>
                                    <h2><i className={styles.squareIcon}></i><span>40 岁以上女性每年一次乳腺钼靶</span></h2>
                                    <h2><i className={styles.squareIcon}></i><span>高风险女性每年 1次乳腺磁共振</span></h2>
                                    <h2><i className={styles.squareIcon}></i><span>20～39 岁女性及怀孕的女性优先选  择乳腺超声检查</span></h2>
                                    <h2><i className={styles.squareIcon}></i><span>20 岁以上的女性每年进行一次乳腺癌筛查</span></h2>
                                  </div>  
                                </div>    
                                    
                              </div>  
                            </div>
                            
                            <div className={styles.conclusionBlock}>
                              <CardTitle title='预防管理' />
                              <div className={`${styles.drawBlock} ${styles.noImg}`}>
                                {infoSix.map((item,index)=>{
                                  return (
                                    <div className={`${styles.drawItem} ${!!item.isShow?`${styles.active}`:''}`} onClick={()=>{this.changeDrawItem(index,'infoSix')}}>
                                      <div className={styles.drawTitle}>
                                        <h1>{item.title}</h1>
                                        <i className={styles.arrow}></i>
                                      </div>
                                      <div className={styles.drawHidePart}>
                                        <div className={styles.drawParaCon}>
                                        <p dangerouslySetInnerHTML={{ __html:item.para }}></p>
                                        </div>        
                                      </div>    
                                    </div>  
                                    )
                                  })
                                }    
                              </div>  
                            </div>
                            {isAnswer!==999 || isHide ? null:<div className={styles.evaluationLink} onClick={()=>this.reviewLink(testing.data)}>
                              情况有改变？<span>点击这里，重新测评</span>
                              </div>
                            }
                        

                          </div> :
                          <div className={styles.conclusionPart}>
                            <div className={styles.conclusionBlock}>
                              <CardTitle title='典型症状' />
                              <div className={`${styles.drawBlock} ${styles.noImg}`}>
                                {infoTwo.map((item,index)=>{
                                  return (
                                    <div className={`${styles.drawItem} ${!!item.isShow?`${styles.active}`:''}`} onClick={()=>{this.changeDrawItem(index,'infoTwo')}}>
                                      <div className={styles.drawTitle}>
                                        <h1>{item.title}</h1>
                                        <i className={styles.arrow}></i>
                                      </div>
                                      <div className={styles.drawHidePart}>
                                        <div className={styles.drawParaCon}>
                                        <p dangerouslySetInnerHTML={{ __html:item.para }}></p>
                                        </div>        
                                      </div>    
                                    </div>  
                                    )
                                  })
                                }    
                              </div>  
                            </div>
                            <div className={styles.conclusionBlock}>
                              <CardTitle title='如何检查' />
                              <div className={`${styles.drawBlock} ${styles.noImg}`}>
                                <div className={styles.drawBlockPara}>卵巢癌常被称为妇科“第一凶癌”。虽然尚不能治愈，但如果定期做检查，一旦患病就有可能提前发现，便于及早接受治疗。一般的卵巢癌辅助检查手段如下：</div>
                                {infoThree.map((item,index)=>{
                                  return (
                                    <div className={`${styles.drawItem} ${!!item.isShow?`${styles.active}`:''}`} onClick={()=>{this.changeDrawItem(index,'infoThree')}}>
                                      <div className={styles.drawTitle}>
                                        <h1>{item.title}</h1>
                                        <i className={styles.arrow}></i>
                                      </div>
                                      <div className={styles.drawHidePart}>
                                        <div className={styles.drawParaCon}>
                                        <p dangerouslySetInnerHTML={{ __html:item.para }}></p>
                                        </div>        
                                      </div>    
                                    </div>  
                                    )
                                  })
                                }    
                              </div>  
                            </div>
                            <div className={styles.conclusionBlock}>
                              <CardTitle title='预防管理' />
                              <div className={`${styles.drawBlock} ${styles.noImg}`}>
                                {infoFour.map((item,index)=>{
                                  return (
                                    <div className={`${styles.drawItem} ${!!item.isShow?`${styles.active}`:''}`} onClick={()=>{this.changeDrawItem(index,'infoFour')}}>
                                      <div className={styles.drawTitle}>
                                        <h1>{item.title}</h1>
                                        <i className={styles.arrow}></i>
                                      </div>
                                      <div className={styles.drawHidePart}>
                                        <div className={styles.drawParaCon}>
                                        <p dangerouslySetInnerHTML={{ __html:item.para }}></p>
                                        </div>        
                                      </div>    
                                    </div>  
                                    )
                                  })
                                }    
                              </div>  
                            </div>
                              

                            {isAnswer!==999 || isHide ? null:<div className={styles.evaluationLink} onClick={()=>this.reviewLink(testing.data)}>
                              情况有改变？<span>点击这里，重新测评</span>
                              </div>
                            }
                          </div> 
                        } 
                      </div>  

                    </div>
                  }
                  <div className={styles.whiteBlock} />
                </div>
              </div>)}
          {
            !isAndall && <div className={styles.top}
              onClick={this.backTop}
              style={showTop ? null : { display: 'none' }}>
              <img src={images.top} alt='' />
            </div>
          }
          {
            !isAndall && QRlist && <ShareBanner QRlist={QRlist} />
          }
        </div>
      </Page>
    )
  }
}

export default report
