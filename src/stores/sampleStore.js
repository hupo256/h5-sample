import { observable, action, runInAction } from "mobx";
import samplingApi from '@src/common/api/samplingApi'

class sampleStore {
  @observable
  data = {
    formData: {},
    loading: true,
  }

  @action
  updatFormData = (name, val) => {
    this.data.formData[name] = val
  }
  
  @action
  checkCollectorType = async (params) => {
    this.data.loading = true;
    try {
      const res = await samplingApi.checkCollectorType(params)
      runInAction(() => {
        console.log(res)
        this.data.kitType = res.data.type
        this.data.loading = false
      })
      return res.data
    } catch (err) {
      this.data.loading = false
    }
  }
}

export default new sampleStore()