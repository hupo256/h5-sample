import { observable, action, runInAction } from "mobx";
import { API } from '@src/common/app'

class user {
	@observable
	data = {
		userInfo: {},
		linkMan: {},
		fxzUser: {},
		unRead: {}
	}

	@action
	getNotReadReportIdentification = async (linkMan) => {
		try {
			const res = await API.getNotReadReportIdentification({ linkManId: linkMan || '' })
			runInAction(() => {
				this.data.unRead = res.code ? {} : res.data
			})
		} catch (err) {
			console.log(err)
		}
	}

	@action
	getFxzUserStatus = async () => {
		if (!this.data.fxzUser.showBubbles) {
			try {
				const res = await API.userNoHJMsg({noloading: 1})
				runInAction(() => {
					this.data.fxzUser = res.code ? {} : res.data
				})
			} catch (err) {
				console.log(err)
			}
		}
	}

	@action
	getLastUserLindManId = async () => {
		try {
			const res = await API.getLastUserLindManId({ noloading: 1 })
			runInAction(() => {
				const params = res.code ? {} : res.data
				params.linkManId && this.setLindManId(params)
			})
		} catch (err) {
			console.log(err)
		}
	}

	@action
	upLindManId = async (params = {}) => {
		window.localStorage.removeItem('lastStatus')
		this.setLindManId(params)
	}

	@action
	setLindManId = (params) => {
		window.localStorage.setItem('linkMan', JSON.stringify({ linkManId: params.linkManId + '', userName: params.userName }))
		andall.invoke('setLinkMan', { linkManId: params.linkManId + '', userName: params.userName })
		this.data.linkMan = { linkManId: params.linkManId + '', userName: params.userName }
	}

	@action
	setUserInfo = async (params) => {
		try {
			const res = await API.myInfo(params)
			runInAction(() => {
				this.data.userInfo = res.code ? {} : res.data
			})
		} catch (err) {
			console.log(err)
		}
	}
}

export default new user()