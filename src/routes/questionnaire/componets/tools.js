import fun from '@src/common/utils'
import questionnaireApi from '@src/common/api/questionnaireApi'
import integrationApi from '@src/common/api/integrationApi'
const { getParams, setSetssion } = fun

// 积分提示
export function getPointTip(callback) {
  const { writeChannel } = getParams()
  const position = +writeChannel === 2 ? 33 : 12
  integrationApi.getPointTip({ position }).then(res => {
    setSetssion('pointValue', res.data.point)
    if (callback) callback(res.data.point)
  })
}

// 获取问卷封面信息
export function queryQuestionInfo(callback) {
  const { qnaireCode } = getParams()
  questionnaireApi.getBasicQnaireInfoByQnaireCode({ qnaireCode }).then(res => {
    if (res) {
      const { data } = res
      if (callback) callback(data)
      setSetssion('toolsType', data.type)
      setSetssion('questionnaireCode', data.questionnaireCode)
      setSetssion('writeChannel', getParams().writeChannel)
      setSetssion('rewrite', getParams().rewrite)
    }
  })
}

// 获取问卷的状态信息
export function touchLastCommitRecord(callback) {
  const { qnaireCode, reportId, linkManId } = getParams()
  questionnaireApi.getUserLastCommitRecord({ qnaireCode, reportId, linkManId }).then(res => {
    const { code, data } = res
    if (!code) {
      if (callback) callback(data.baseInfoFlag)
      if (data.finishStatus === 1) {
        window.history.replaceState({}, '', `${origin}/mkt/questionnaire/qsend${location.search}`)
        window.location.reload()
      }
    }
  })
}

