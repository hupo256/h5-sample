import { observable, action } from 'mobx'

class HpvReport {
	@observable
	data = {
	  loading: true,
	  noscroll: false,
	}
    @action
	toggleNoscroll = () => {
	  this.data.noscroll = !this.data.noscroll
	  console.log(this.data.noscroll + '--------')
	}
}

export default new HpvReport()
