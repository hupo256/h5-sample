import { observable, action, runInAction } from "mobx";
// import { API } from '@src/common/app'
import userApi from '@src/common/api/userApi'
import homeApi from '@src/common/api/homeApi'
import accountApi from '@src/common/api/accountApi'
import reportApi from '@src/common/api/reportApi'

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
			const res = await reportApi.getNotReadReportIdentification({ linkManId: linkMan || '' })
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
				const res = await accountApi.userNoHJMsg()
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
			const res = await homeApi.getLastUserLindManId({ noloading: 1 })
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
		andall.invoke('setLinkMan', { linkManId: params.linkManId + '', userName: params.userName })
	}

	@action
	setLindManId = (params) => {
		window.localStorage.setItem('linkMan', JSON.stringify({ linkManId: params.linkManId + '', userName: params.userName }))
		this.data.linkMan = { linkManId: params.linkManId + '', userName: params.userName }
	}
	
	@action
	setUserInfo = async (params) => {
		try {
			const res = await userApi.myInfo(params)
			runInAction(() => {
				this.data.userInfo = res.code ? {} : res.data
			})
		} catch (err) {
			console.log(err)
		}
	}
}

export default new user()