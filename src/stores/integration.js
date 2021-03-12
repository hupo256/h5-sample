import { observable, action, runInAction } from 'mobx'
import integrationApi from '@src/common/api/integrationApi'

class Integration {
	@observable
	data = {
	  pointsHome: {},
	  loading: true,
	}

	@action
	getPointHomeInfo = async () => {
	  this.data.loading = true
	  try {
	    const res = await integrationApi.getPointHomeInfo({ noloading: 1 })
	    runInAction(() => {
	      console.log(res.data)
	      this.data.pointsHome = res.data
	      this.data.loading = false
	    })
	  } catch (err) {
	    this.data.loading = true
	    console.log(err)
	  }
	}
}

export default new Integration()
