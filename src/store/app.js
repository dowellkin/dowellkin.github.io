export default {
	namespaced: true,

	state: {
		update: {
			worker: null,
			status: false,
			group: null
		}
	},
	mutations: {
		setUpdate(state, value) {
			// console.log(value);
			state.update = value;
		},
		setGroup(state, value) {
			// console.log(value);
			state.group = value;
		}
	},
	actions: {
	},
	getters: {
		isNeedReloadToBeUpdated(state){
			return state.update;
		},
		group(state) {
			return state.group;
		}
	}
}