import { observable, action, runInAction } from "mobx"
import activeApi from '@src/common/api/activeApi'

class Platform365 {
	@observable
	data = {
		list: [],
		loading: true,
	}

	@action
	touchArticleCon = (obj) => {
		this.data.articleCon= obj
	}

	@action
	getNutrilonToolsIndex = async (id) => {
		this.data.loading = true;
		try {
			const res = await activeApi.getNutrilonToolsIndex()
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
}

export default new Platform365()