import { createAction } from 'redux-actions'
import { API } from '@src/common/app'

const setRedNumber = createAction('SET_RED_NUMBER')
const updataNumber = createAction('UPDATA_NUMBER')

export const mapDispatchToProps = {
  // 获取购物车小红点数量
  queryCartProdCount:() => {
    return (dispatch, getState) => {
      API.queryCartProdCount({ noloading:1 }).then(res => {
        const { code, data } = res
        if (!code) {
          dispatch(setRedNumber(data || 0))
        }
      })
    }
  },
  // 数量点加减更新
  upDataNum (type) {
    return (dispatch, getState) => {
      dispatch(updataNumber(type))
    }
  }
}

export const mapStateToProps = state => {
  const { number } = state.cat
  return { number }
}
