import firebase from 'firebase/app'
export default {
	actions: {
		async loadSchedule(state) {
			const db = firebase.database()

			const ans = await db.ref('/').once("value")
			state.commit('saveSchedule', ans.val())
		},
	},

	state: {
		mainSchedule: []
	},

	mutations: {
		saveSchedule(state, data) {
			state.mainSchedule = data
			console.log('data loaded:', state.mainSchedule)
		}
	},
	
	getters: {
		fullScheldue(state){
			return state.mainSchedule
		}
	}
}