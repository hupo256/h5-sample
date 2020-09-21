import React, { Component } from 'react'
import styles from '../newDetails/detail'
import CardTitle from './cardTitle'
import { Carousel } from 'antd-mobile'
import ShowOrHide from './showOrHide'
import images from '../images'
import propTypes from 'prop-types'

class TabCard extends Component {
  static propTypes = {
    goKeyDetail:propTypes.func,
    data:propTypes.object
  }
  state = {
    isFixedTop:false,
    _top:'',
    tabs:['菌群改善', '健康风险', '科学细节'],
    activeTab:0,
    data: ['1', '2', '3'],
    slideIndex:0,
    supplySuggestDto:[], // 补充建议
    advise1:[
      {
        question:'什么是益生菌制剂',
        answer:'<div>益生菌制剂是含有活性益生菌的产品，含有益生元及其他辅料。益生元是益生菌的“粮食”，可以帮助益生菌在肠道内更好的生长。其他辅料可以帮助益生菌通过胆汁消化和胃酸低pH值的考验到达肠道。</div>'
      },
      {
        question:'如何选择益生菌产品',
        answer:'<div>在为宝宝选择益生菌时，我们可以从四个方面进行考量。</div><p>1、看菌株</p><div>确认产品安全性，是否是符合国家规定的益生菌，可参考《 可用于婴幼儿食品的菌种名单》 。</div><p>2、看功效</p><div>益生菌成分要明确，是否对症，并且菌株含量要足够，这个直接关系到补充是否有效果。</div><p>3、看配料</p><div>益生菌成分要明确，是否对症，并且菌株含量要足够，这个直接关系到补充是否有效果。</div><p>4、看口感</p><p>挑选适合宝宝服用的剂型，对于还没有添加辅食的宝宝，使用滴剂或粉剂与奶粉混合更容易服用；对于已经可以吃辅食的宝宝，可以添加酸奶增加益生菌的口感，良好的口感才能让宝宝主动配合补充。</p>'
      },
      {
        question:'服用益生菌的注意事项',
        answer:'<div>1. 按照说明书妥当保存，在有效期内使用。</div><div>2. 益生菌的服用温度不宜超过40℃，过高的温度会使死亡，丧失功效。</div><div>3. 益生菌是是厌氧菌，暴露在空气中会失活，冲泡后尽快服用。</div><div>4.益生菌不能与抗生素同时服用，需至少间隔2-3小时，否则益生菌会被抗生素杀死，失去功效。</div><div>5. 按说明书服用足够的活菌量，才能起到效果。</div>',
      }
    ],
    testList:[
      {
        name:'免疫力水平',
        result:'高',
        range:90,
        kinds:[]
      },
      {
        name:'过敏风险',
        result:'低',
        range:10,
        kinds:[
          {
            name:'拟杆菌',
            result:92,
            range:'0.0-91.9'
          },
          {
            name:'双歧杆菌',
            result:121,
            range:'>=54'
          },
          {
            name:'阿克曼氏菌',
            result:0.003,
            range:'>=0.02'
          },
          {
            name:'乳酸杆菌',
            result:0,
            range:'>=1.4'
          }
        ],
        questionList:[
          {
            question:'什么是过敏？',
            answer:'<div>益生菌制剂是含有活性益生菌的产品，含有益生元及其他辅料。益生元是益生菌的“粮食”，可以帮助益生菌在肠道内更好的生长。其他辅料可以帮助益生菌通过胆汁消化和胃酸低pH值的考验到达肠道。</div>'
          },
          {
            question:'菌群与过敏',
            answer:'<div>益生菌制剂是含有活性益生菌的产品，含有益生元及其他辅料。益生元是益生菌的“粮食”，可以帮助益生菌在肠道内更好的生长。其他辅料可以帮助益生菌通过胆汁消化和胃酸低pH值的考验到达肠道。</div>'
          },
        ]
      },
      {
        name:'肠胀气风险',
        result:'中等',
        range:50,
        kinds:[]
      },
      {
        name:'消化不良风险',
        result:'低',
        range:20,
        kinds:[]
      }
    ],
    resultAnalysisList:[
      {
        name:'免疫力水平',
        result:'高',
      },
      {
        name:'过敏风险',
        result:'低',
      },
      {
        name:'肠胀气风险',
        result:'中等',
      },
      {
        name:'消化不良风险',
        result:'低',
      }
    ],
    floraKinds:{
      desc:'每个⼈的肠道菌群差异很⼤，有200-1000种不等。根据细菌对人体健康的作用，可分为有益菌、中性菌和有害菌。',
      kinds:[
        {
          title:'1. 有益菌',
          text:'有益菌是有益于人体健康的细菌，如乳酸杆菌、双歧杆菌等，它们通常能够产生一些利于人体健康的物质如短链脂肪酸、维生素等，改善肠道环境，调节免疫系统，抑制有害菌的生长。'
        },
        {
          title:'2. 中性菌',
          text:'中性菌是肠道环境中存在数量最多的细菌，通常情况下对人体无害。但在肠道菌群紊乱时，其中一些条件致病菌就得到大量繁殖的机会，也会对人体健康造成危害，特别是它们通过血液循环扩散到身体的其它部位的情况下。'
        },
        {
          title:'3. 有害菌',
          text:'有害菌是危害肠道健康的细菌，它们的大量繁殖，会破坏肠道系统的生态平衡，有些致病菌还能够分泌各种毒素，引起腹泻、呕吐、便秘等各种病症。'
        }
      ]
    }
  };
  componentDidMount () {
    // window.addEventListener('scroll', this.onWindowScroll)
    this.setState({ _top:document.getElementById('tabs').offsetTop })
  }
  componentWillUnmount () {
    window.removeEventListener('scroll', this.onWindowScroll)
  }
  onWindowScroll = () => {
    let h = document.body.scrollTop || document.documentElement.scrollTop
    this.setState({
      isFixedTop:h > this.state._top
    })
  }
  changeTab=(index) => {
    let { _top } = this.state
    this.setState({ activeTab:index }, () => {
      window.scrollTo(0, _top)
      if (index === 1) {
        this.state.testList.map((item, index) => {
          document.getElementById(`range${index + 1}`).style.width = item.range * 1.5 + 'px'
        })
      }
    })
  }

  render() {
    const { goKeyDetail, data } = this.props
    const { tabs, activeTab, testList, advise1, floraKinds, isFixedTop, supplySuggestDto } = this.state
    return (
      <div className={styles.tabCard}>
        <div className={`${styles.tabs} ${isFixedTop ? styles.fixTop : ''}`} id='tabs'>
          <div className={styles.thisTab}>
            {
              tabs.map((item, index) => (
                <span key={index} className={`${index === activeTab ? styles.activeTab : ''}`} onClick={() => { this.changeTab(index) }}>
                  {item}
                </span>
              ))
            }
          </div>
        </div>
        <div className={styles.tabOne}>
          {
            activeTab === 0
              ? <div className={styles.desc}>
                <span>根据宝宝当前的菌群情况，建议遵循以下措施调理</span>
                <span className={styles.red}>2-3周后进行复检</span>
                <span>，以便查看宝宝肠道菌群的改善情况。</span>
              </div>
              : activeTab === 1
                ? <div className={styles.desc}>
                  <span>根据小安目前的肠道菌群结构，对以下健康风险进行评估，结果显示有 </span>
                  <span className={styles.red}>3</span>
                  <span>项 需要重点关注。</span>
                </div>
                : ''
          }
          {
            activeTab === 0
              ? <div>
                <CardTitle title={'益生菌补充建议'} />
                <div className={`${styles.square} ${styles.supplementAdvise}`}>
                  <div className={styles.carousel}>
                    <Carousel
                      autoplay
                      infinite
                      selectedIndex={this.state.slideIndex}
                    >
                      {this.state.data.map((val, index) => (
                        <div key={index} className={styles.box}>
                          <img src={images.demo} />
                          <div className={styles.right}>
                            <h5>百适滴益生菌滴剂</h5>
                            <p>方案1</p>
                          </div>
                        </div>
                      ))}
                    </Carousel>
                  </div>
                  {/* <ShowOrHide type={1} data={supplySuggestDto[1].split('</h2>')} /> */}
                </div>
                <div>
                  <CardTitle title={data.feedWayDto.title} />
                  <div className={`${styles.square} ${styles.feedAdvise}`}>
                    {
                      data.feedWayDto.feedWay.map((item, index) => (
                        <p key={index}>{index + 1}.{item}</p>
                      ))
                    }
                  </div>
                </div>
                {
                  data.relief.map((item, index) => (
                    <div key={index}>
                      <CardTitle title={item.title} />
                      <div className={`${styles.square} ${styles.feedAdvise}`}>
                        <div dangerouslySetInnerHTML={{ __html:item.description }} />
                      </div>
                    </div>
                  ))
                }
                <div>
                  <CardTitle title={'你需要注意'} />
                  <div className={`${styles.square} ${styles.needNotice}`}>
                    <div className={styles.title}>
                      <span>菌群与健康</span>
                      <img src={images.notice} />
                    </div>
                    <div className={styles.advise}>
                      <p /><span>正常情况下，有益菌产生大量抑菌物质，抑制有害菌的繁殖，减少肠道内的有害物质产生；</span>
                    </div>
                    <div className={styles.advise}>
                      <p /><span>菌群紊乱时，有益菌数量减少，有害菌数量增加，肠道保护力降低，宝宝容易生病；</span>
                    </div>
                    <div className={styles.advise}>
                      <p /><span>肠道菌群紊乱会加快过敏、湿疹、哮喘、自闭症、肥胖、发育不良等慢性疾病的发生发展；</span>
                    </div>
                    <div className={styles.advise}>
                      <p /><span>宝宝的肠道菌群变化受很多人为因素影响，抓住这些关键期进行检测对宝宝肠道菌群的建立至关重要。</span>
                    </div>
                  </div>
                </div>
                <div className={`${styles.square} ${styles.needNotice} ${styles.top16}`}>
                  <div className={styles.title}>
                    <span>宝宝肠道菌群建立的关键期</span>
                    <img src={images.time} />
                  </div>
                  <div className={styles.imgList}>
                    <img src={images.key1} />
                    <img src={images.key2} />
                    <img src={images.key3} />
                    <img src={images.key4} />
                    <img src={images.key5} />
                    <img src={images.key6} />
                  </div>
                  <div className={styles.detailsBtn} onClick={goKeyDetail}>
                    <span>点击了解更多内容</span>
                    <img src={images.right} />
                  </div>
                </div>
              </div>
              : activeTab === 1
                ? <div>
                  <div className={`${styles.square} ${styles.testItems}`}>
                    <div className={styles.title}>
                      <span>检测项目</span>
                      <span>检测结果</span>
                    </div>
                    <div className={styles.result}>
                      {
                        testList.map((item, index) => (
                          <div key={index}>
                            <span>{item.name}</span>
                            <div className={styles.range}>
                              <label id={`range${index + 1}`} />
                            </div>
                            <span>{item.result}</span>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                  <div>
                    <CardTitle title={'评估结果分析'} />
                    <div className={`${styles.resultAnalysis}`}>
                      <ShowOrHide type={2} data={testList} />
                    </div>
                    <div>
                      <CardTitle title={'温馨提示'} />
                      <div className={`${styles.square} ${styles.needNotice}`}>
                        <div className={`${styles.advise} ${styles.top0}`}>
                          <p />
                          <span>婴儿在0-3岁时期肠道菌群变化较大，有益菌缺乏、有害菌超标会增加腹痛腹泻、过敏几率，导致营养不良、身材瘦小、抵抗力弱易生病等不良症状。</span>
                        </div>
                        <div className={styles.advise}>
                          <p />
                          <span>肠道菌群平衡是一个动态变化的过程，每一次检测结果只针对本次采集便便样品的时间，并不代表所有时间点的肠道微生物状态。</span>
                        </div>
                        <div className={styles.advise}>
                          <p />
                          <span>建议家长每隔1-3个月监测一次宝宝肠道菌群的动态变化，实时了解宝宝的肠道健康状况。</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                : <div>
                  <div>
                    <CardTitle title={'菌群分类'} />
                    <div className={`${styles.square} ${styles.floraKinds}`}>
                      <div className={styles.words}>{floraKinds.desc}</div>
                      {
                        floraKinds.kinds.map((item, index) => (
                          <div key={index} className={`${styles.words} ${index === floraKinds.kinds.length - 1 ? styles.bottom0 : ''}`}>
                            <p>{item.title}</p>
                            <p>{item.text}</p>
                          </div>
                        ))
                      }
                    </div>
                    <CardTitle title={'样本的存储'} />
                    <div className={`${styles.square} ${styles.floraKinds}`}>
                      <div className={`${styles.words} ${styles.bottom0}`}>
                      肠道菌群检测，棉签沾取便便样本后需要放在保存液中，保存液可以抑制细菌生长并保存住核酸，在室温情况下可保存15天。但仍建议采样后尽快回寄。
                      </div>
                    </div>
                    <CardTitle title={'安我实验室'} />
                    <div className={`${styles.square} ${styles.floraKinds}`}>
                      <h5>国家认证临床医学检验所</h5>
                      <div className={`${styles.words}`}>
                      安我基因拥有国家卫健委认证的医学检验所资质，提供专业的基因检测服务，具备向医疗机构提供检验报告和医学检验结果咨询的资质。
                      </div>
                      <div className={`${styles.words} ${styles.bottom0}`}>
                      安我基因拥有国家认证的临床医学实验室GeneX-Lab™，年规划检测量为百万级别，检测时间和自动化程度均处于行业领先地位。
                      </div>
                      <img src={images.room} />
                    </div>
                    <CardTitle title={'肠道菌群检测技术'} />
                    <div className={`${styles.square} ${styles.floraKinds}`}>
                      <div className={`${styles.words} ${styles.bottom0}`}>
                      采用高通量测序技术，利用Miseq 平台，以人类微生物组计划中的16s rDNA 测序技术为基础，对人体肠道菌群的种类与数量进行检测。
                      </div>
                      <img src={images.process} className={styles.process} />
                    </div>
                    <CardTitle title={'检测限制'} />
                    <div className={`${styles.square} ${styles.floraKinds}`}>
                      <div className={`${styles.words}`}>
                        肠道菌群平衡是一个动态变化的过程，每一次检测结果只针对本次采集便便样品的时间，并不代表所有时间点的肠道微生物状态。
                      </div>
                      <div className={`${styles.words} ${styles.bottom0}`}>
                        肠道菌群恢复健康状态的调理周期因人而异，婴儿在0-3岁时期菌群变化较大，建议每隔1-3个月监测一次宝宝肠道菌群的动态变化，关注宝宝肠道健康。
                      </div>
                    </div>
                  </div>
                </div>
          }
        </div>

        <div className={`${styles.coupon}`} onClick={() => this.modalToggle()}>
          <div className={styles.left}>
            <label>¥</label><span>{50}</span>
          </div>
          <div className={styles.right}>
            <div>加购有惊喜！</div>
            <p>=====</p>
          </div>
        </div>

      </div >
    )
  }
}

export default TabCard
