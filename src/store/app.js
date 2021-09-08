export default {
	namespaced: true,

	state: {
		update: {
			worker: null,
			status: false
		}
	},
	mutations: {
		setUpdate(state, value) {
			// console.log(value);
			state.update = value;
		}
	},
	actions: {
	},
	getters: {
		isNeedReloadToBeUpdated(state){
			return state.update;
		}
	}
}