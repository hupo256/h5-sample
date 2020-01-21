import axios from 'axios';
export default {
	/**
	 * 获取首页列表页数据
	 * @returns {Promise.<*>}
	 */
	getList(){
		return axios.get( 'http://localhost:3001/equipments' )
		.then( ( res ) => res.data );
	},

	getItem(id){
		return axios.get( `http://localhost:3001/equipments/${id}` )
		.then( ( res ) => res.data );
	},

	creatItem(paras){
		return axios.post( 'http://localhost:3001/equipments', paras )
	},

	updateItem(paras){
		return axios.put( `http://localhost:3001/equipments/${paras.id}`, paras )
		.then( ( res ) => res.data );
	},

	deleteItem(id){
		return axios.delete( `http://localhost:3001/equipments/${id}` )
	}
}