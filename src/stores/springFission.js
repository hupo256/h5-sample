import { observable, action, runInAction } from "mobx"
import { API } from '@src/common/app'

class springFission {
	@observable
	data = {
		loading: true,
	}

	@action
	touchArticleCon = (obj) => {
		this.data.articleCon= obj
	}

  @action
	getActivInfoByActivId = async (params) => {
		this.data.loading = true
		try {
			const [share, active] = await Promise.all([
        API.createShareCode(params),
        API.getActivInfoByActivId(params)
      ])
			runInAction(() => {
        if(active.code){
					this.data.loading = true
					return
				}
				const { status } = active.data
				this.data.activeData = active.data
				this.data.shareData = share.data
				this.data.loading = status === 8 || status === 3 || status === 4
			})
		} catch(err) {
			this.data.loading = false
			console.log(err)
		}
  }
}

export default new springFission()