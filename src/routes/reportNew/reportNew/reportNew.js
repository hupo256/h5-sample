import React from 'react'
import { Page } from '@src/components'
class reportNew extends React.Component {
  state = {
    list:[
      {
        id: 1,
        title: '文章测试1',
        html: '内容1',
        prev: null,
        next: {
          id: 2,
          title: '文章测试2'
        }
      },
      {
        id: 2,
        title: '文章测试2',
        html: '内容2',
        prev: {
          id: 1,
          title: '文章测试1'
        },
        next: {
          id: 3,
          title: '文章测试3'
        }
      },
      {
        id: 3,
        title: '文章测试3',
        html: '内容3',
        prev: {
          id: 2,
          title: '文章测试2'
        },
        next: {
          id: 4,
          title: '文章测试4'
        }
      },
      {
        id: 4,
        title: '文章测试4',
        html: '内容4',
        prev: {
          id: 3,
          title: '文章测试3'
        },
        next: null
      },
    ],
    index: 0,
    start: 0,
    end: 0,
    top: 0,
    bottom: 0,
    ease: 0,
    maxHeight: 100,
    setTime: null
  };

  componentDidMount() {
    document.body.scrollIntoView()
  }

  onTouchStart = e => {
    this.setState({
      start: e.touches[0].clientY,
      ease: 0
    })
    clearTimeout(this.state.setTime)
  }

  onTouchMove = e => {
    const { start, maxHeight } = this.state
    const onPullUpHeight = this.refs.scrollContent.clientHeight
    const documentHeight = document.documentElement.clientHeight
    const documentTop = document.documentElement.scrollTop

    const end = e.touches[0].clientY

    // console.log("onPullUpHeight:"+onPullUpHeight);
    // console.log("documentHeight:"+documentHeight);
    // console.log("documentTop:"+documentTop);
    // console.log("start:"+start);
    // console.log("end:"+end);
    // start为拇指按下点，end为拇指当前点
    // end - (start + documentTop)为top值
    // start - end - (onPullUpHeight - documentHeight - documentTop)为bottom值
    console.log(documentTop)

    console.log(start - end - (onPullUpHeight - documentHeight - documentTop))
    const top = start < end && end - start > documentTop ? end - (start + documentTop) > maxHeight ? maxHeight : end - (start + documentTop) : 0
    const bottom = start > end && start - end > onPullUpHeight - documentHeight - documentTop ? start - end - (onPullUpHeight - documentHeight - documentTop) > maxHeight ? maxHeight : start - end - (onPullUpHeight - documentHeight - documentTop) : 0
    this.setState({
      top,
      bottom,
      end
    })
  }

  onTouchEnd = e => {
    const { list, top, bottom, maxHeight } = this.state
    let { index } = this.state

    // 下拉
    if (top >= maxHeight && !!list[index].prev) {
      index--
      this.setState({
        index,
        loading: true,
        setTime: setTimeout(() => {
          this.init()
        }, 1000)
      })
    }
    // 上拉
    else if (bottom >= maxHeight && !!list[index].next) {
      index++
      this.setState({
        index,
        loading: true,
        setTime: setTimeout(() => {
          this.init()
        }, 1000)
      })
    }
    // 还原，给个缓动动画，之后还原
    else {
      this.setState({
        top: 0,
        bottom: 0,
        ease: 0.5,
        setTime: setTimeout(() => {
          this.init()
        }, 500)
      })
    }
  }

  // settimeout与init结合为模拟数据加载
  init = () => {
    this.setState({
      start: 0,
      end: 0,
      top: 0,
      bottom: 0,
      ease: 0,
      loading: false
    })
  }

  render() {
    const { list, index, top, bottom, ease, loading, maxHeight } = this.state
    // 页面结构需要注意超出部分显示，最外部div需要超出部分隐藏且不能设置高度
    return (
      <Page title='健康测评'>
        <div style={{ overflow: 'hidden' }}>
          {loading ? (
            <div style={{ position: 'absolute', zIndex: 10, width: '100%', height: '100%', background: '#ccc', color: '#fff', textAlign: 'center' }}>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>loading...</div>
            </div>
          ) : (
            <div ref='scrollContent' style={{ minHeight: '100vh', overflow: 'visible', position: 'relative', transform: 'translate3d(0px,' + (top || -bottom) + 'px,0px)', transition: 'all ' + ease + 's ease' }}
              onTouchMove={this.onTouchMove} onTouchStart={this.onTouchStart} onTouchEnd={this.onTouchEnd}>
              <div style={{ width: '100%', height: maxHeight, textAlign: 'center', lineHeight: maxHeight + 'px', background: '#eee', position: 'absolute', top: '-' + maxHeight + 'px' }}>
                {list[index].prev ? (
                  <div style={{ position: 'relative', margin: 'auto', top: '50%', transform: 'translate(0, -50%)', lineHeight: 'normal' }}>
                    <div>{top >= maxHeight ? '释放' : '下拉'}加载</div>
                    <div>上一篇：{list[index].prev.title}</div>
                  </div>
                ) : '没有啦'}
              </div>
              <div style={{ fontSize: '50px', lineHeight: 'normal' }}>{list[index].html}</div>
              <div style={{ width: '100%', height: maxHeight, textAlign: 'center', lineHeight: maxHeight + 'px', background: '#eee', position: 'absolute', bottom: '-' + maxHeight + 'px' }}>
                {list[index].next ? (
                  <div style={{ position: 'relative', margin: 'auto', top: '50%', transform: 'translate(0, -50%)', lineHeight: 'normal' }}>
                    <div>{bottom >= maxHeight ? '释放' : '上拉'}加载</div>
                    <div>下一篇：{list[index].next.title}</div>
                  </div>
                ) : '没有啦'}
              </div>
            </div>
          )}
        </div>
      </Page>
    )
  }
}
export default reportNew
