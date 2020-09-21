import { observable, action, runInAction } from "mobx"
import activeApi from '@src/common/api/activeApi'

class Yinyang {
	@observable
	data = {
		list: [],
		indexdata: {},
		solutiondata: {},
		noscroll: false,
		articleCon: null,
		loading: true,
	}

	@action
	touchArticleCon = (obj) => {
		this.data.articleCon= obj
	}

	@action
	swichLinkManId = (id) => {
		this.data.indexdata.curLinkManId = id
	}

	@action
	toggleNoscroll = () => {
		this.data.noscroll = !this.data.noscroll
	}
	
	@action
	getNutrilonToolsIndex = async (id) => {
		this.data.loading = true;
		try {
			const res = await activeApi.getNutrilonToolsIndex({linkManId: id})
			runInAction(() => {
				this.data.indexdata = res.data
				// this.data.indexdata.newUserPageFlag = 1

				this.data.loading = false
			})
		} catch(err) {
			this.data.loading = true
			console.log(err)
		}
	}

	@action
	getNutrilonToolsSolution = async (params) => {
		this.data.loading = true
		try {
			const res = await activeApi.getNutrilonToolsSolution(params)
			runInAction(() => {
				this.data.solutiondata = res.data
				this.data.loading = false
			})
		} catch(err) {
			this.data.loading = true
			console.log(err)
		}
	}
  
  @action
	getActivInfoByActivId = async (params) => {
		this.data.loading = true
		try {
			const [share, active] = await Promise.all([
        activeApi.createShareCode(params),
        activeApi.getActivInfoByActivId(params)
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

export default new Yinyang()