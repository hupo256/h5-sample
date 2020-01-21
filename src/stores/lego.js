import { observable, action, runInAction } from "mobx";
import { API } from '@src/common/app'

class legoStore {
	@observable
	data = {
		activeData: {},
    shareData: {},
    qrCodeData: {},
    loading: true,
  }

  @action
	assistActiv = async (params) => {
		this.data.loading = true;
		try {
			const res = await API.assistActiv(params)
			runInAction(() => {
				this.data.qrCodeData = res.code ? {} : res.data
				this.data.loading = false
			})
		} catch(err) {
			this.data.loading = false
			console.log(err)
		}
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

				// active.data.status = 2

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

export default new legoStore()