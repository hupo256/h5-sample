import ua from '@src/common/utils/ua'

export function gotoQuestions(linkManId, qnaireCode, rewrite, back){
  const nextUrl = `${origin}/mkt/questionnaire?linkManId=${linkManId}&qnaireCode=${qnaireCode}&writeChannel=2${rewrite ? '&rewrite=1' : ''}`
  ua.isAndall() && (location.href = `andall://andall.com/inner_webview?url=${nextUrl}`)
  ua.isAndall() || (location.href = nextUrl)
  // if(back) return
  setTimeout(() => {
    window.history.go(back)
  }, 400)
}

