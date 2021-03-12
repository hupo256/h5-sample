import { observable, action, runInAction } from "mobx"
import memberApi from '@src/common/api/memberApi'
// import jsonData from './institute.json'

class Institute {
	@observable
	data = {
    currItem: {},
		loading: true,
	}

	@action
	touchCurrItem = (item) => {
    this.data.currItem = item
  }
  
	@action
	getResearchPageInfo = async (params) => {
		this.data.loading = true;
		try {
      const userInfor = await memberApi.myInfo(params)
      const res = await memberApi.getResearchPageInfo({userId: userInfor.data.userId, noloading:1})
			return runInAction(() => {
				this.data = {...this.data, ...res.data}
        this.data.loading = false
        return this.data
      })
		} catch(err) {
			this.data.loading = true
			console.log(err)
    }
	}
}

export default new Institute()